import { NextFunction } from "express";
import { InternalServerError, ValidationError } from "../errors";
import { IRequest, IResponse, IUserRegister } from "../interfaces";
import { userService } from "../services";
import { validateSchema } from "../validations";
import Controller from "./base.controller";

class UsersController extends Controller {
	sayHello(req: IRequest, res: IResponse<any>) {
		res.json({
			message: "Success",
		});
	}

	async createUser(req: IRequest<IUserRegister>, res: IResponse<any>, next: NextFunction) {
		try {
			// // validate
			// const validate = await validateSchema.createUser().safeParseAsync(req.body);
			// if(!validate.success){
			// 	throw new ValidationError("Validation Error!", validateSchema.formatErrors(validate.error.errors));
			// }
			const user = await userService.createUser(req.body);
			res.json({
				data: user,
				message: 'User register'
			});
		} catch (error) {
			next(error);
		}
	}
}

export default new UsersController();