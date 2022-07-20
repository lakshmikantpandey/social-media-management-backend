import { NextFunction } from "express";
import { NotFoundError } from "../errors";
import { IRequest, IResponse, ISocialType } from "../interfaces";
import { Channel } from "../models";
import { SocialService } from "../services";
import { socialAccounts } from "../services/social_modules";
import Controller from "./base.controller";

// TODO : Social app integration
class SocialController extends Controller {

    async getSocialLogin(req: IRequest<any, any, ISocialType>, res: IResponse<any>, next: NextFunction) {
        try {
            const { social_type } = req.query;
            res.json({
                message: "Social Login",
                data: await SocialService.getSocialLogin(social_type, req.user?.id || 0)
            });
        } catch (error) {
            next(error);
        }
    }

}

export default new SocialController();