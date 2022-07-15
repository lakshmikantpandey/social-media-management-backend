import { IUserRegister, IQueryModel } from "../interfaces";

class UsersService implements IQueryModel {

    findById(arg: any): any {
        return "";
    }

    createUser(body: IUserRegister) {}

    verifyUser() {}

}

export default new UsersService();