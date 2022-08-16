import { Router } from "express";
import { ChannelController } from "../controllers";
import { jwtMiddleware, validSchema } from "../middlewares";
import { validateSchema } from "../validations";

const channelRoute = Router();

channelRoute.get('/channels', jwtMiddleware ,ChannelController.getChannels);
channelRoute.post('/channels/assign-channel', [ validSchema(validateSchema.assignChannel) ,jwtMiddleware] , ChannelController.assignChannel);
channelRoute.delete('/channels/remove-channel/:id', [ validSchema(validateSchema.removeChannel) ,jwtMiddleware] , ChannelController.removeChannel);
channelRoute.get('/channels/get-authenticated-channels', jwtMiddleware ,ChannelController.getAuthChennels);

export default channelRoute;