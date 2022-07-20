const ENV = process.env;
import {Linkedin} from "./linkedin.service"
import {Instagram} from "./instagram.service"
// import {Twitter} from "./twitter.service"
import { social } from "./socials.interface";
import { Facebook } from "./facebook.service";

const LinkedinService = new Linkedin({
    ClientId: ENV.LINKEDIN_CLIENT_ID,
    ClientSecret: ENV.LINKEDIN_CLIENT_SECRET,
    AccessTokenURL: ENV.LINKEDIN_ACCESSTOKEN,
    OnAuthCallbackURL: ENV.LINKEDIN_CALLBACK,
    AuthURL: ENV.LINKEDIN_AUTH,
    RegisterUploadURL: ENV.LINKEDIN_REGISTER_UPLOAD_API,
    ShareURL: ENV.LINKEDIN_SHARE_API,
    UgcPost: ENV.LINKEDIN_UGCPOST_URL
});

const InstagramService = new Instagram({

    ClientId:ENV.INSTAGRAM_CLIENT_ID,
    ClientSecret:ENV.INSTAGRAM_CLIENT_SECRET,
    AccessTokenURL: ENV.INSTAGRAM_ACCESS_TOKEN,
    OnAuthCallbackURL: ENV.INSTAGRAM_CALLBACK,
    AuthURL:ENV.INSTAGRAM_AUTH,
});

const FacebookService = new Facebook({

    ClientId:ENV.FACEBOOK_CLIENT_ID,
    ClientSecret:ENV.FACEBOOK_CLIENT_SECRET,
    AccessTokenURL:ENV.FACEBOOK_ACCESS_TOKEN ,
    OnAuthCallbackURL: ENV.FACEBOOK_CALLBACK,
    AuthURL:ENV.FACEBOOK_AUTH
    
});

// const TwitterService = new Twitter(
//     {
//         ClientId:ENV.TWITTER_CLIENT_ID,
//         ClientSecret:ENV.TWITTER_CLIENT_SECRET,
//         AccessTokenURL:ENV.TWITTER_ACCESS_TOKEN,
//         OnAuthCallbackURL: ENV.TWITTER_CALLBACK,
//         AuthURL:ENV.TWITTER_AUTH
//     }
// );
      
const socialAccounts:{[key:string]: social}= {
    "Ln":LinkedinService,
    "In":InstagramService,
    "Fb":FacebookService,
    // "Tw":TwitterService,
}
export {
    LinkedinService,
    InstagramService,
    FacebookService,
    // TwitterService,
    socialAccounts
}