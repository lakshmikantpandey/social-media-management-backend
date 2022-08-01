
import axios from "axios";
import moment from "moment";
import { escape as stringUrlEnocde } from "querystring";
import { InternalServerError } from "../../errors";

import { Linkedin, LinkedinAuthParams, LinkedinServiceConfig, PostDetails } from "./linkedin.service";
import { social, SocialPage, SocialAccessToken, SocialUser, SocialPostParams } from "./socials.interface";

interface postDetails {
    likes: number,
    unlikes: number,
    totalComments: number
}
interface LinkedinAccessTokenParams {
    Code: any,
}
interface FacebookServiceConfig {
    ClientId?: string;
    ClientSecret?: string;
    AccessTokenURL?: string;
    OnAuthCallbackURL?: String;
    AuthURL?: String;
    UgcPost?: string;
    RegisterUploadURL?: string
    ShareURL?: string;
}
class Facebook implements social {
    config: FacebookServiceConfig = {
        AccessTokenURL: "https://graph.facebook.com/v12.0/oauth/access_token",
        AuthURL: "https://www.facebook.com/v12.0/dialog/oauth"
    };
    name: string = "Facebook";
    constructor(config: FacebookServiceConfig) {
        this.config = config;
    }
    getPost(params: any) {
        throw new Error("Method not implemented.");
    }
    setConfig(config: FacebookServiceConfig) {
        this.config = config;
        return this;
    }
    getAuth(params: LinkedinAuthParams) {
        const url = `${this.config.AuthURL}?client_id=${this.config.ClientId}&redirect_uri=${this.config.OnAuthCallbackURL}&state=${params.State}&scope=email,pages_show_list,pages_read_engagement,pages_manage_posts,public_profile`;
        return url;
    }
    async getAccessToken(params: LinkedinAccessTokenParams): Promise<SocialAccessToken> {
        try {
            const accessToken = await axios({
                method: 'GET',
                url: `${this.config.AccessTokenURL}?fields=expires_in&client_id=${this.config.ClientId}&client_secret=${this.config.ClientSecret}&code=${params.Code}&redirect_uri=${this.config.OnAuthCallbackURL}`
            });
            const body = accessToken.data;
            if (body.access_token === '') {
                throw new Error("Unauthorized access. Please try again");
            }
            return {
                Token: body.access_token,
                ExpireDate: moment().add(60, 'days').format('YYYY-MM-DD HH:mm:ss'),
                Error: null
            }
        } catch (error) {
            throw error;
        }
    }
    async getUser(params: any): Promise<SocialUser> {
        throw new Error("Method not implemented.");
    }
    async getPages(params: { Token: any }): Promise<SocialPage[]> {

        const url = "https://graph.facebook.com/v11.0/me/accounts?fields=picture{url},access_token,name,id"

        const pagesRes = await axios({
            method: "GET",
            url: `${url}&access_token=${params.Token}`,

        });

        let Pages: SocialPage[] = pagesRes.data.data.map((page: any) => {
            return {
                Name: page.name,
                Id: page.id,
                ProfilePicture: page.picture.data.url,
                AccessToken: page.access_token
            }
        })

        const result = Pages;
        return result
    }
    async createPost(params: SocialPostParams): Promise<{ PostId: string, Published?: boolean }> {
        params.TextContent = stringUrlEnocde(params.TextContent || "")
        if (params.SignOff) {
            params.TextContent = `${params.TextContent} ${params.SignOff}`;
        }
        if (params.Tags) {
            params.TextContent = `${params.TextContent} ${params.Tags}`;
        }

        try {

            let postTypeParams: string = `feed?`
            if (params.MediaContent && params.MediaContent.length > 0) {
                if (params.MediaContent[0].Type == "Video") {
                    postTypeParams = `videos?url=${params.MediaContent[0].File}`
                } else if (params.MediaContent[0].Type == "Image") {
                    postTypeParams = `photos?url=${params.MediaContent[0].File}`
                }
            } else {

            }
            console.log("created url ", `https://graph.facebook.com/${params.Credentials.Id}/${postTypeParams}&message=${params.TextContent}&access_token=${params.Credentials.Token}`)
            const fbPostRes = await axios({
                method: "POST",
                url: `https://graph.facebook.com/${params.Credentials.Id}/${postTypeParams == "feed?" ? postTypeParams : postTypeParams + "&"}message=${params.TextContent}&access_token=${params.Credentials.Token}`,
            });

            const { id, post_id } = fbPostRes.data;

            if (postTypeParams == `feed?`) {
                return {
                    PostId: post_id,
                    Published: true
                }
            }

            const fbPublishRes = await axios({
                method: "POST",
                url: `https://graph.facebook.com/${post_id}?is_published=true&access_token=${params.Credentials.Token}`,
            });

            return {
                PostId: post_id,
                Published: fbPublishRes.data.success
            }
        } catch (err) {
            throw err;
        }
    }
    deletePost() {
        throw new Error("Method not implemented.");
    }
    editPost() {
        throw new Error("Method not implemented.");
    }
    getPostDetails() {
        throw new Error("Method not implemented.");
    }
    replyPost() {
        throw new Error("Method not implemented.");
    }
}


export {
    Facebook
}

