import { NextFunction } from "express";
import { IRequest, IResponse, ISelectedFacebookPage, ISocialType, IVerifyFacebook, IVerifyLinkedin } from "../interfaces";
import { socialService } from "../services";
import Controller from "./base.controller";
const ENV = process.env;

// TODO : Social app integration
class SocialController extends Controller {

    async getSocialLogin(req: IRequest<any, any, ISocialType>, res: IResponse<any>, next: NextFunction) {
        try {
            console.log(req.query);
            
            const { social_type } = req.query;
            res.json({
                message: "Social Login",
                data: await socialService.getSocialLogin(social_type, req.user?.id || "")
            });
        } catch (error) {
            next(error);
        }
    }

    // DONE : Linkedin verification pending
    async verifyLinkedin(req: IRequest<IVerifyLinkedin>, res: IResponse<any>, next: NextFunction) {
        try {
            console.log("Logged in User: ", req.user?.id);
            
            const linkedin = await socialService.verifyLinkedIn(req.body, req.user?.id);
            res.json({
                message: "Verify Linkedin",
                data: linkedin
            });
        } catch (error) {
            next(error);
        }
    }

    // DONE : Facebook verification
    async verifyFacebook(req: IRequest<IVerifyFacebook>, res: IResponse<any>, next: NextFunction) {
        try {
            const fb = await socialService.verifyFacebook(req.query);
            // res.json({
            //     message: "Facebook verified",
            //     data: []
            // });
            res.redirect(`${ENV.REDIRECT_URL}agent/social-media?success=1&pages=Fb&name=Facebook`);
        } catch (error) {
            next(error);
        }
    }

    // get facebook pages
    async getFacebookPages(req: IRequest<any>, res: IResponse<any>, next: NextFunction) {
        try {
            const pages = await socialService.getPages(req);
            res.json({
                message: "facebook pages",
                data: pages
            });
        } catch (error) {
            console.log("Errors: ", error);
            next(error);
        }
    }

    // TODO : save selected social page
    async saveFacebookPage(req: IRequest<ISelectedFacebookPage>, res: IResponse<any>, next: NextFunction){
        try {
            const pages = await socialService.saveFacebookPage(req.body);
            res.json({
                message: "Page saved successfully",
                data: pages
            });
        } catch (error) {
            next(error);
        }
    }

}

export default new SocialController();