export interface ISocialType {
    social_type: string;
}

export interface IVerifyLinkedin {
    code: string;
    state: string;
}

export interface IVerifyFacebook extends IVerifyLinkedin {}

export interface IFacebookPages {
    id?:number;
    user_id: string;
    pages: any[],
    token: string;
    channel_type: string;
}