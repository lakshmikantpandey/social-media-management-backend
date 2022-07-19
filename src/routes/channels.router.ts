import { Router } from "express";
import { ChannelController } from "../controllers";

const channelRoute = Router();

channelRoute.get('/channels', ChannelController.getChannels);

export default channelRoute;