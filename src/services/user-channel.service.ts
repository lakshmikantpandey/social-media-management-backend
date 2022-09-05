import { IUserChannel, IUserChannelPermissions, IUserChannelSchedules, IUserChannelTimezone } from "../interfaces";
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

    // DONE: get connected channel
    async getConnectedChannel(user_id: string, columns: string[] = ["id"]) {
        return await UserChannel.query()
            .select(...columns)
            .where("user_id", user_id)
            .andWhere("is_active", true)
            .andWhere("deleted_at", null)
            .castTo<IUserChannel[]>();
    }

}

export default new UserChannelService();