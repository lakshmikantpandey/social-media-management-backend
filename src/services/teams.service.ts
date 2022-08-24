import { nanoid } from "nanoid";
import path from "path";
import { compileFile } from "pug";
import { jwtHelper } from "../helpers";
import { IInviteMember, IRequest, IUser, IUserRegister, IUserVerifyToken, IVerifyMember } from "../interfaces";
import { Team, User } from "../models";
import { PasswordUtil } from "../utils";
import emailService from "./email.service";

class TeamService {

    async inviteMember(body: IInviteMember & { parent_id?: string }) {
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

        // check if user exists
        let user = await User.query().where('email', body.email).first().castTo<IUser>();
        if(user) {
            if (!user.is_active) {
                this.sendNotification(user);
            }
        } else {
            // save user
            const trxUser = await User.startTransaction();
            // let user;
            try {
                user = await User.query(trxUser).insert(registerUser).castTo<IUser>();
                await trxUser.commit();
            } catch (error) {
                await trxUser.rollback();
                throw error;
            }
            // team add
            let saved_team = null;
            if(user?.id){
                const team = {
                    admin_access: body.admin_access,
                    channels: JSON.stringify(body.channels),
                    user_id: user?.id
                };
                saved_team = await Team.query().insert(team);
            }
            // send email
            this.sendNotification(user);
        }
        return {
            id: user.id,
            email: user.email
        };
    }

    private sendNotification(user: IUser) {
        const tokenBody = {
            id: user.id,
            email: user.email
        };
        const token = jwtHelper.createVerifyToken(tokenBody);
        emailService.sendEmail({
            to: [ { Email: user.email, Name: user.first_name } ],
            subject: 'User Invitation',
            html: compileFile(path.join(__dirname, '../views/emails/invite.pug'))({
                host: `${process.env.APP_HOST}:${process.env.APP_PORT}${process.env.API_V1}/invitation?token=${token}`,
                email: user.email
            })
        });
    }

    async verifyMember(body: IVerifyMember) {
        const user = await jwtHelper.verifyToken(body.token) as IUserVerifyToken;
        // update user
        await User.query().patch({
            is_active: true,
            password: PasswordUtil.hashPassword(body.password)
        }).where("id", user.id || 0);
    }

}

export default new TeamService();