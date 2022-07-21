import { NextFunction } from "express";
import { IRequest, IResponse, ISocialType, IVerifyLinkedin } from "../interfaces";
import { socialService } from "../services";
import Controller from "./base.controller";

// TODO : Social app integration
class SocialController extends Controller {

    async getSocialLogin(req: IRequest<any, any, ISocialType>, res: IResponse<any>, next: NextFunction) {
        try {
            const { social_type } = req.query;
            res.json({
                message: "Social Login",
                data: await socialService.getSocialLogin(social_type, req.user?.id || 0)
            });
        } catch (error) {
            next(error);
        }
    }

    // DONE : Linkedin verification pending
    async verifyLinkedin(req: IRequest<IVerifyLinkedin>, res: IResponse<any>, next: NextFunction) {
        try {
            const linkedin = await socialService.verifyLinkedIn(req.body);
            res.json({
                message: "Verify Linkedin",
                data: linkedin
            });
        } catch (error) {
            next(error);
        }
    }

}

export default new SocialController();