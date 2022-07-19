import { IChannel } from "../interfaces";
import { Channel } from "../models";

class ChannelService {

    async getChannels() {
        return await Channel.query()
            .select("id", "channel", "slug", "image")
            .where('is_active', true).castTo<IChannel[]>();
    }

}

export default new ChannelService();