import moment from "moment";
import { ref } from 'objection';
import { InternalServerError, NotFoundError } from "../errors";
import { IAssignChannel, IChannel, IUserChannel, IRequest, IChannelState } from "../interfaces";
import { Channel, UserChannel } from "../models";
import { MomentTZ } from "../utils";
import channelSvg from '../utils/channel.util';

class ChannelService {

    async getChannels() {
        return await Channel.query()
            .select("id", "channel", "slug", "image")
            .where('is_active', true).orderBy("channel").castTo<IChannel[]>();
    }

    async assignChannel( req: IRequest<IAssignChannel> ) {
        const body = req.body;
        body.expired_at = "2022-01-01";
        body.is_active = true;
        const channel = await UserChannel.query().insert({...body, user_id: req.user?.id});
        return channel;
    }

    async removeChannel(id: string) {
        const channel = await UserChannel.query().findById(id)
            .where("deleted_at", null)
            .first().castTo<IUserChannel>();

        if(!channel){
            throw new NotFoundError("Coonected account not found");
        }
        // delete channel
        await UserChannel.query().findById(id).patch({
            deleted_at: new Date(),
            is_active: false
        });
    }

    async createChannelState(body: IChannelState) {
        try {
            await UserChannel.query().insert(body);
        } catch (error) {
            throw error;
        }
    }

    async getAuthChannels(req: IRequest){
        const channelList = await UserChannel.query()
                            .select(
                                'channel_type',
                                'id',
                                ref('user_auth:first_name').castText().as("first_name"),
                                ref('user_auth:last_name').castText().as("last_name"),
                            )
                            .where("user_id", req.user?.id || 0)
                            .andWhere("is_active", true)
                            .andWhere("deleted_at", null);
        const channels = channelList.map((channel: any) => {
            return {...channel, image: channelSvg[channel?.channel_type] };
        });
        return channels;
    }

}

export default new ChannelService();