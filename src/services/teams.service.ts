import { IInviteMember, IUser, IUserRegister } from "../interfaces";
import { Team, User } from "../models";

class TeamService {

    async inviteMember(body: IInviteMember & { parent_id?: number }) {
        // prepare create user body
        const registerUser: IUserRegister = {
            first_name: body.first_name,
            last_name: body.last_name,
            email: body.email,
            username: body.email,
            password: "0",
            mobile: "0",
            role: "sub-creator",
            parent_id: body.parent_id
        };

        // save user
        const trxUser = await User.startTransaction();
        let user;
        try {
            user = await User.query().insert(registerUser).castTo<IUser>();
            await trxUser.commit();
        } catch (error) {
            await trxUser.rollback();
            throw error;
        }
        // team add
        const team = {
            admin_access: body.admin_access,
            channels: JSON.stringify(body.channels),
            user_id: user?.id
        };
        const saved_team = await Team.query().insert(team);
        return saved_team;
    }

}

export default new TeamService();