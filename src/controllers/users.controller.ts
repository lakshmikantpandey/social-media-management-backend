import { NextFunction } from "express";
import { jwtHelper } from "../helpers";
import { IRequest, IResponse, IUser, IUserRegister } from "../interfaces";
import { userService } from "../services";
import Controller from "./base.controller";

class UsersController extends Controller {
	sayHello(req: IRequest, res: IResponse<any>) {
		res.json({
			message: "Success",
		});
	}

	async createUser(req: IRequest<IUserRegister>, res: IResponse<any>, next: NextFunction) {
		try {
			const user = await userService.createUser(req.body);
			res.json({
				data: [],
				message: 'User register'
			});
		} catch (error) {
			next(error);
		}
	}

	async verifyUser(req: IRequest<any>, res: IResponse<any>, next: NextFunction){

		try {
			// decode jwt
			const user: IUser = await userService.verifyUser(req);
			res.json({
				data: {
					user: user.email
				},
				message: 'User Verified'
			});
		} catch (error) {
			next(error);
		}

	}

}

export default new UsersController();