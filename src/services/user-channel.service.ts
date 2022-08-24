import { IUserChannelPermissions, IUserChannelSchedules, IUserChannelTimezone } from "../interfaces";
import { UserChannel } from "../models";

class UserChannelService {

    // DONE : Update Channel schedules
    async updateSchedules(body: IUserChannelSchedules) {
        // update query
        await UserChannel.query().patch({
            schedules: body.arg
        }).where('id', body.channel_id);
    }

    // DONE: Update timezone
    async updateTimezone(body: IUserChannelTimezone) {
        // update timezone
        await UserChannel.query().patch({
            timezone: body.tz
        }).where('id', body.channel_id);
    }

}

export default new UserChannelService();