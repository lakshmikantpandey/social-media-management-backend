import { NextFunction } from "express";
import { IAssignChannel, IChannel, IRemoveChannel, IRequest, IResponse } from "../interfaces";
import { channelService } from "../services";
import Controller from "./base.controller";

class ChannelController extends Controller {
    
    async getChannels(req: IRequest, res: IResponse<IChannel[]>) {
        const channels = await channelService.getChannels();
        res.json({
            data: channels,
            message: "Channels"
        });
    }

    // DONE : Pending Assign User to Channel
    async assignChannel(req: IRequest<IAssignChannel>, res: IResponse<any>, next: NextFunction) {
        try {
            const channel = await channelService.assignChannel(req);
            res.json({
                data: channel,
                message: "Channel Assigned"
            });
        } catch (error) {
            next(error);
        }
    }

    async removeChannel(req: IRequest<IRemoveChannel>, res: IResponse<any>, next: NextFunction) {
        try {
            await channelService.removeChannel(req.params.id);
            res.json({
                message: 'channel deleted successfully!'
            });
        } catch (error) {
            next(error);
        }
    }

}

export default new ChannelController();