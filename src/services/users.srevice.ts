import { ConflictError } from "../errors";
import { IUserRegister, IUser } from "../interfaces";
import { User } from "../models";
import { PasswordUtil } from "../utils";

class UsersService {

    async findById(id: number): Promise<IUser> {
        return await User.query().where('id', id).first().castTo<IUser>();
    }

    async createUser(body: IUserRegister) {
        // validation handle
        
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
        return { id, first_name, last_name, username, role, email };
    }

    async findByUsername(username: string): Promise<IUser> {
        return await User.query().where('username', username).first().castTo<IUser>();
    }

    verifyUser() {}

}

export default new UsersService();