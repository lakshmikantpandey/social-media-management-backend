import { NextFunction } from "express";
import { IChannel, IRequest, IResponse } from "../interfaces";
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

    // TODO : Pending Assign User to Channel
    async assignChannel(req: IRequest, res: IResponse<any>) {
        res.json({
            message: "Channel Assigned"
        });
    }

}

export default new ChannelController();