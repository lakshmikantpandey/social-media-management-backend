

interface SocialPage{
   Name?:string,Id?:string,AccessToken?:string,ProfilePicture?:string
}
interface SocialAccessToken{
    Token:string|null,
    ExpireDate:any,
    Error:null|any;
}
interface SocialUser{ 
    FirstName: string; 
    LastName: string; 
    Username: string; 
    id: any; 
    Following: any; 
    Followers: any; 
}
interface SocialPostParams{ 
    Credentials:{Token:any,Id:any,Name:string,State?:any},
    MediaContent?:{Type:"Image"|"Video",File:string}[],
    TextContent?:string,
    Tags?:string[]|string,
    SignOff?:string 
}
interface socialToken{
    Token:any
} 
interface social{
    name:string
    config:any;
    setConfig(config:any): any;
    getAuth(params:{State:any}):string;
    getAccessToken(params:{Code:any}):Promise<SocialAccessToken>;
    getUser(params:socialToken):Promise<SocialUser>;
    getPages(params:socialToken):Promise<SocialPage[]>;
    createPost(params:SocialPostParams):Promise<{PostId:string,Published?:boolean}>;
    getPost(params: any): any;
    editPost(params: any): any;
    deletePost(params: any): any;
    replyPost(params: any): any;
}

export{
    social,
    SocialPage,
    SocialAccessToken,
    SocialUser,
    SocialPostParams
}