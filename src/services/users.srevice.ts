import path from "path";
import { compileFile } from "pug";
import { ConflictError } from "../errors";
// import { JwtHelper } from "../helpers";
import { IUserRegister, IUser, IRequest, IUserVerifyToken } from "../interfaces";
import { User } from "../models";
import { PasswordUtil } from "../utils";
import { emailService } from "../services";
import { jwtHelper } from "../helpers";

class UsersService {

    async findById(id: number): Promise<IUser> {
        return await User.query().where('id', id).first().castTo<IUser>();
    }

    async createUser(body: IUserRegister) {

        // find user
        const user = await this.findByUsername(body.username);
        // check if user exists
        if(user) {
            throw new ConflictError('User already exists.');
        }
        // hash password
        body.password = PasswordUtil.hashPassword(body.password);
        // save user
        const newUser = await User.query().insert(body).castTo<IUser>();
        const { id, first_name, last_name, username, role, email } = newUser;
        // check if email send

        const token = jwtHelper.createVerifyToken({
            id: id,
            email: body.email
        });

        emailService.sendEmail({
            to: [ { Email: body.email, Name: body.first_name } ],
            subject: 'User Registration',
            html: compileFile(path.join(__dirname, '../views/emails/register.pug'))({ 
                host: `${process.env.APP_HOST}:${process.env.APP_PORT}${process.env.API_V1}/verify-token?token=${token}`,
            })
        });

        return { id, first_name, last_name, username, role, email };
    }

    async findByUsername(username: string): Promise<IUser> {
        return await User.query().where('username', username).first().castTo<IUser>();
    }

    async verifyUser(req: IRequest) : Promise<IUser> {
        const decoded: IUserVerifyToken = await jwtHelper.verifyToken(req.query.token as string) as IUserVerifyToken;
        // get user detail
        const user = await this.findById(decoded.id || 0) as IUser;
        if(user.is_active) {
            throw new ConflictError("User already verified");
        }
        // update query
        await User.query().findById(decoded.id || 0).patch({
            is_active: true
        });
        return user;
    }

}

export default new UsersService();