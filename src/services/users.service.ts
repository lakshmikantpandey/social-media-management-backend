import path from "path";
import { compileFile } from "pug";
import { ConflictError, NotFoundError, UnauthorizedError } from "../errors";
// import { JwtHelper } from "../helpers";
import { IUserRegister, IUser, IRequest, IUserVerifyToken, IUserLogin, IUserEdit } from "../interfaces";
import { User } from "../models";
import { PasswordUtil } from "../utils";
import { emailService } from ".";
import { jwtHelper } from "../helpers";
import { IChangePassword } from "../interfaces/user.interface";

class UsersService {

    async findById(id: string): Promise<IUser> {
        return await User.query().where('id', id).first().castTo<IUser>();
    }

    async createUser(body: IUserRegister) {

        // find user
        const user = await this.findByUsername(body.email);
        // check if user exists
        if(user) {
            throw new ConflictError('User already exists.');
        }
        // hash password
        body.password = PasswordUtil.hashPassword(body.password);
        body.role = "creator";
        body.username = body.email;
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
                host: `${process.env.REDIRECT_VERIFY_TOKEN}?token=${token}`,
            })
        });

        return { id, first_name, last_name, username, role, email, link: `${process.env.REDIRECT_VERIFY_TOKEN}?token=${token}` };
    }

    async findByUsername(username: string): Promise<IUser> {
        return await User.query().where('username', username).first().castTo<IUser>();
    }

    async verifyUser(req: IRequest) : Promise<IUser> {
        const decoded: IUserVerifyToken = await jwtHelper.verifyToken(req.query.token as string) as IUserVerifyToken;
        // get user detail
        const user = await this.findById(decoded.id || "") as IUser;
        if(user.is_active) {
            throw new ConflictError("User already verified");
        }
        // update query
        await User.query().findById(decoded.id || 0).patch({
            is_active: true
        });
        return user;
    }

    async userLogin(body: IUserLogin) {
        const user = await this.findByUsername(body.username) as IUser;
        if(!user){
            throw new UnauthorizedError("Invalid username or password");
        }
        if(!user.is_active){
            throw new NotFoundError("Invalid User");
        }
        // verify password
        if(!PasswordUtil.comparePassword(body.password, user.password)){
            throw new UnauthorizedError("Invalid username or password");
        }
        // create token
        const userDetail = {
            id: user.id,
            firstName: user.first_name,
            lastName: user.last_name,
            role: user.role,
            email: user.email,
            mobile: user.mobile
        };
        const token = jwtHelper.generateToken(userDetail).token;
        return {...userDetail, token};
    }

    async editUser(req: IRequest<IUserEdit>) {
        const body = req.body;
        const user = await User.query().findById(req.user?.id || 0).first().castTo<IUser>();
        await User.query().findById(req.user?.id || 0).patch({
            first_name: body.first_name,
            last_name: body.last_name,
            mobile: body.mobile,
            role: user.role,
            email: user.email
        });
        return user;
    }

    async changePassword(req: IRequest<IChangePassword>) {
        const body = req.body;
        const user = await this.findById(req.user?.id || "") as IUser;
        // validate old password
        if (PasswordUtil.comparePassword(body.old_password, user.password)) {
            // change password
            const updateBody = {
                password: PasswordUtil.hashPassword(body.new_password)
            };
            await User.query().findById(user.id || 0).patch(updateBody);
            return true;
        } else {
            throw new UnauthorizedError("Invalid Old Password");
        }
    }

    async getUserDetail(uid: string){
        const user = await User.query()
            .select("first_name", "last_name", "email", "role", "mobile")
            .findById(uid)
            .castTo<IUser>();
        if(!user) {
            throw new NotFoundError("User not found");
        }
        return user;
    }

    async forgetPassword(email:string) {
        // check if email exists
        const user = await User.query()
            .where("email", email)
            .first();
        if(!user){
            throw new NotFoundError("Invalid Account");
        } else {
            // TODO : send forget email pending
        }
    }

}

export default new UsersService();