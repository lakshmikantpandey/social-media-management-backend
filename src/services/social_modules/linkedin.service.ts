
import axios from "axios";
import { UrlToBinary } from "../../helpers";
import { social, SocialPage, SocialAccessToken, SocialPostParams } from "./socials.interface";
import moment from "moment";

const ENV = process.env;

class Linkedin implements social {

    config: LinkedinServiceConfig;
    name: string = "Linkedin";

    constructor(config: LinkedinServiceConfig) {
        this.config = config;
    }
    
    async getUser(params: { Token: string }): Promise<{ FirstName: string; LastName: string; Username: string; id: any; Following: any; Followers: any; }> {
        const url = "https://api.linkedin.com/v2/me";
        try {
            const user = await axios({
                url: url,
                headers: {
                    'Authorization': `Bearer ${params.Token}`
                }
            })

            return {
                FirstName: user.data.localizedFirstName,
                LastName: user.data.localizedLastName,
                id: user.data.id,
                Followers: 0,
                Following: 0,
                Username: user.data.localizedFirstName + " " + user.data.localizedLastName
            }
        } catch (error) {
            throw error
        }
    }
    getPages(params: { Token: any }): any {
        const noPages: SocialPage[] = [
        ]
        return noPages;
    }
    async getAccessToken(params: { Code: any }): Promise<SocialAccessToken> {
        try {
            const tokenResponse = await axios({
                method: 'GET',
                url: `${this.config.AccessTokenURL}?grant_type=authorization_code&code=${params.Code}&redirect_uri=${this.config.OnAuthCallbackURL}&client_id=${this.config.ClientId}&client_secret=${this.config.ClientSecret}`,
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            })
            const body = tokenResponse.data
            return {
                Token: body.access_token,
                ExpireDate: moment().add(body.expires_in, 'seconds').format('YYYY-MM-DD HH:mm:ss'),
                Error: null
            }

        } catch (error) {
            throw error;
        }


    }
    setConfig(config: LinkedinServiceConfig) {
        this.config = config
    }
    getAuth(params: LinkedinAuthParams): string {
        if (this.config == null) {
            throw new Error(typeof this + "config is null please set config first.");
        }
        const urlparams = `response_type=code&client_id=${this.config.ClientId}&redirect_uri=${this.config.OnAuthCallbackURL}&state=${params.State}&scope=r_liteprofile,r_emailaddress,w_member_social`;
        return `https://www.linkedin.com/oauth/v2/authorization?${urlparams}`;
    }
    async createPost(params: SocialPostParams): Promise<{ PostId: string, Published?: boolean }> {

        const IsMediaPost = params.MediaContent && params.MediaContent.length > 0;
        const credentials = params.Credentials

        if (params.SignOff) {
            params.TextContent = `${params.TextContent} ${params.SignOff}`;
        }
        if (params.Tags) {
            params.TextContent = `${params.TextContent} ${params.Tags}`;
        }

        try {
            if (IsMediaPost) {
                const registerPostRequsetBody = {
                    "registerUploadRequest": {
                        "owner": `urn:li:person:${credentials.Id}`,
                        "recipes": [
                            "urn:li:digitalmediaRecipe:feedshare-image"
                        ],
                        "serviceRelationships": [
                            {
                                "identifier": "urn:li:userGeneratedContent",
                                "relationshipType": "OWNER"
                            }
                        ],
                        "supportedUploadMechanism": [
                            "SYNCHRONOUS_UPLOAD"
                        ]
                    }
                };
                const registerPostResponse = await axios({
                    url: `${this.config.RegisterUploadURL}`,
                    method: "POST",
                    headers: {
                        'Authorization': `Bearer ${credentials.Token}`
                    },
                    data: registerPostRequsetBody
                });
                const uploadRes = registerPostResponse.data;
                const assetUrl = uploadRes.value.asset;
                const uploadUrl = uploadRes.value.uploadMechanism['com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest']['uploadUrl'];
                const resBinary = await UrlToBinary(params.MediaContent ? params.MediaContent[0].File : "");
                //Image upload
                const uploadMediaResponse = await axios({
                    method: 'post',
                    url: uploadUrl,
                    headers: {
                        'Authorization': `Bearer ${credentials.Token}`,
                        'X-Restli-Protocol-Version': '2.0.0',
                        'Content-Type': 'image/jpeg',
                    },
                    data: resBinary
                });

                //Post upload               
                const postContent = {
                    "author": `urn:li:person:${credentials.Id}`,
                    "lifecycleState": "PUBLISHED",
                    "specificContent": {
                        "com.linkedin.ugc.ShareContent": {
                            "shareCommentary": {
                                "attributes": [],
                                "text": params.TextContent
                            },
                            "shareMediaCategory": "IMAGE",
                            "media": [
                                {
                                    "media": assetUrl,
                                    "status": "READY",
                                    "title": {
                                        "text": "Sp Amplifier Image Content"
                                    }
                                }
                            ]
                        }
                    },
                    "visibility": {
                        "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC"
                    }
                };
                const postRes = await axios({
                    method: 'post',
                    url: `${this.config.UgcPost}`,
                    headers: {
                        'Authorization': `Bearer ${credentials.Token}`,
                        'Content-Type': 'application/json'
                    },
                    data: JSON.stringify(postContent),
                    timeout: 1000 * 5 // wait for 5 seconds
                })
                const { id } = postRes.data
                return {
                    PostId: id,
                    Published: true
                }
            } else {

                let postDescriptionBody = `${params.TextContent}`;
                if (params.SignOff) {
                    postDescriptionBody = `${postDescriptionBody} ${params.SignOff}`;
                }
                if (params.Tags) {
                    postDescriptionBody = `${postDescriptionBody} #${params.Tags}`;
                }
                const postBody = {
                    "distribution": {
                        "linkedInDistributionTarget": {}
                    },
                    "owner": `urn:li:person:${credentials.Id}`,
                    "subject": "SP Amplifier",
                    "text": {
                        "text": postDescriptionBody
                    }
                };
                //Post-request
                const postRes = await axios({
                    method: "POST",
                    url: `${ENV.LINKEDIN_SHARE_API}`,
                    headers: {
                        'Authorization': `Bearer ${credentials.Token}`,
                        'Content-Type': 'application/json'
                    },
                    data: JSON.stringify(postBody)
                });
                const { id } = postRes.data
                return {
                    PostId: id,
                    Published: true
                }

            }
        } catch (err) {
            throw err;
        }
    }
    async getPost(params: LinkedinPostParams): Promise<PostDetails> {
        const credentials = JSON.parse(params.Credentials);
        const uri = `https://api.linkedin.com/v2/ugcPosts/${params.Urn}?viewContext=AUTHOR`
        const reqheaders = {
            'Authorization': `Bearer ${credentials.token}`
        }
        const post = await axios.get(uri, { headers: reqheaders })
        const details: PostDetails = {
            dislike: post.data.dislike,
            like: post.data.likes,
            shares: post.data.shares
        }
        return details;
    }
    async editPost() {
        throw new Error("Method not implemented.");
    }
    async replyPost() {
        throw new Error("Method not implemented.");
    }
    async deletePost(params: LinkedinPostParams) {
        const uri = `https://api.linkedin.com/v2/ugcPosts/${params.Urn}`
        const credentials = JSON.parse(params.Credentials);
        const reqheaders = {
            'Authorization': `Bearer ${credentials.token}`
        }
        const post = await axios.get(uri, { headers: reqheaders })
        return post.data;
    }
}

interface LinkedinPostParams {
    Title: string;
    Body: string;
    Images: [string];
    Credentials: string;
    PostDescription: string;
    SignOff: string;
    HashTag: string;
    PostPublishId: string;
    Urn: string;
}

interface LinkedinServiceConfig {
    ClientId?: string;
    ClientSecret?: string;
    AccessTokenURL?: string;
    OnAuthCallbackURL?: String;
    AuthURL?: String;
    UgcPost?: string;
    RegisterUploadURL?: string
    ShareURL?: string;
}

interface LinkedinAuthParams {
    State?: string;
}

interface PostDetails {
    like: number,
    dislike: number,
    shares: number,
}
export {

    Linkedin,
    LinkedinPostParams,
    LinkedinServiceConfig,
    LinkedinAuthParams,
    PostDetails
}
