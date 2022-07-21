import moment from "moment";
import { InternalServerError, NotFoundError } from "../errors";
import { IAssignChannel, IChannel, IUserChannel, IRequest, IChannelState } from "../interfaces";
import { Channel, UserChannel } from "../models";
import { MomentTZ } from "../utils";

class ChannelService {

    async getChannels() {
        return await Channel.query()
            .select("id", "channel", "slug", "image")
            .where('is_active', true).castTo<IChannel[]>();
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
            deleted_at: MomentTZ().format("YYYY-MM-DD"),
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

}

export default new ChannelService();