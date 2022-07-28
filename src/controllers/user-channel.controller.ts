import { NextFunction } from "express";
import { IRequest, IResponse, IUserChannelPermissions, IUserChannelSchedules, IUserChannelTimezone } from "../interfaces";
import { userChannelService } from "../services";
import Controller from "./base.controller";

class UserChannelController extends Controller {
    
    // TODO
    async updateSchedules(req: IRequest<IUserChannelSchedules>, res: IResponse<any>, next: NextFunction) {
        try {
            await userChannelService.updateSchedules(req.body);
            res.json({
                message:"Schedules updated successfully!"
            });
        } catch (error) {
            next(error);
        }
    }

    // TODO
    async updateTimezone(req: IRequest<IUserChannelTimezone>, res: IResponse<any>, next: NextFunction) {
        try {
            await userChannelService.updateTimezone(req.body);
            res.json({
                message:"Timezone updated successfully!"
            });
        } catch (error) {
            next(error);
        }
    }

}

export default new UserChannelController();