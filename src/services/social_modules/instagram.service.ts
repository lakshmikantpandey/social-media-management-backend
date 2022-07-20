
import axios, { AxiosRequestConfig } from "axios";
import moment from "moment";
import { escape as stringUrlEnocde } from "querystring";
import { Linkedin, LinkedinAuthParams, LinkedinPostParams, LinkedinServiceConfig, PostDetails } from "./linkedin.service";
import { social, SocialPage, SocialAccessToken, SocialUser, SocialPostParams } from "./socials.interface";

interface postDetails {
    likes: number,
    unlikes: number,
    totalComments: number
}

interface LinkedinAccessTokenParams {
    Code: any,
}

interface InstagramServiceConfig {
    ClientId?: string;
    ClientSecret?: string;
    AccessTokenURL?: string;
    OnAuthCallbackURL?: String;
    AuthURL?: String;
    UgcPost?: string;
    RegisterUploadURL?: string
    ShareURL?: string;
}

class Instagram implements social {
    name: string = "Instagram";
    config: InstagramServiceConfig = {
        AccessTokenURL: "https://graph.facebook.com/v12.0/oauth/access_token",
        AuthURL: "https://www.facebook.com/v12.0/dialog/oauth"
    };

    constructor(config: InstagramServiceConfig) {
        this.config = config;
    }

    getPost(params: any) {
        throw new Error("Method not implemented.");
    }

    setConfig(config: InstagramServiceConfig) {
        this.config = config;
        return this;
    }

    getAuth(params: LinkedinAuthParams) {
        const url = `${this.config.AuthURL}?
        client_id=${this.config.ClientId}&redirect_uri=${this.config.OnAuthCallbackURL}
        &state=${params.State}&scope=instagram_basic,pages_read_engagement,instagram_content_publish,pages_show_list`;
        return url;
    }

    async getAccessToken(params: LinkedinAccessTokenParams): Promise<SocialAccessToken> {
        try {
            const tokenResponse = await axios({
                method: 'GET',
                url: `${this.config.AccessTokenURL}?fields=expires_in&client_id=${this.config.ClientId}&client_secret=${this.config.ClientSecret}&code=${params.Code}&redirect_uri=${this.config.OnAuthCallbackURL}`
            })
            const body = tokenResponse.data

            return {
                Token: body.access_token,
                ExpireDate: moment().add(60, 'days').format('YYYY-MM-DD HH:mm:ss'),
                // ExpireDate:moment().add(body.expires_in,'seconds').format('YYYY-MM-DD HH:mm:ss'),
                Error: null
            }
        } catch (error) {
            return {
                Token: null,
                ExpireDate: null,
                Error: error
            };
        }
    }

    getUser(params: any): Promise<SocialUser> {
        throw new Error("Method not implemented.");
    }

    async getPages(params: { Token: any }): Promise<SocialPage[]> {

        const url = "https://graph.facebook.com/v11.0/me/accounts?fields=connected_instagram_account{username, profile_picture_url,id},name,username,picture{url}"

        const pagesRes = await axios({
            method: "GET",
            url: `${url}&access_token=${params.Token}`
        })
        console.log(pagesRes.data)

        let Pages: SocialPage[] = pagesRes.data.data.map((page: any) => {

            const { username, profile_picture_url, id } = page.connected_instagram_account
            return {
                Name: username,
                Id: id,
                ProfilePicture: profile_picture_url,
                AccessToken: params.Token
            }

        });

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
            let postTypeParams: string = `feed`

            if (params.MediaContent && params.MediaContent.length > 0) {
                if (params.MediaContent[0].Type == "Video") {
                    postTypeParams = `media?media_type=VIDEO&video_url=${params.MediaContent[0].File}`
                } else if (params.MediaContent[0].Type == "Image") {
                    postTypeParams = `media?media_type=IMAGE&image_url=${params.MediaContent[0].File}`
                }
            }
            const createPostUrl = `https://graph.facebook.com/${params.Credentials.Id}/${postTypeParams}&caption=${params.TextContent}&access_token=${params.Credentials.Token}`
            const fbPostRes = await axios({
                method: "POST",
                url: createPostUrl,
            })
            const { id, post_id } = fbPostRes.data;
            const publishPostUrl = `https://graph.facebook.com/${params.Credentials.Id}/media_publish?creation_id=${id}&access_token=${params.Credentials.Token}`
            const inPublishRes = await axios({
                method: "POST",
                url: publishPostUrl,
            })

            console.log(`${this.name} "Requests: 1)create_post-${createPostUrl} 2)publish-${publishPostUrl}`)

            return {
                PostId: id,
                Published: true
            }
        } catch (err) {
            throw err
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
    Instagram
}

