import { NextFunction } from "express";
import { IChangePassword, IForgetPassword, IRequest, IResponse, IUser, IUserEdit, IUserLogin, IUserRegister, IUserSchedules } from "../interfaces";
import { userService, userSettingService } from "../services";
import usersSrevice from "../services/users.service";
import Controller from "./base.controller";

class UsersController extends Controller {

	async createUser(req: IRequest<IUserRegister>, res: IResponse<any>, next: NextFunction) {
		try {
			const user = await userService.createUser(req.body);
			res.json({
				data: user,
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

	async userLogin(req: IRequest<IUserLogin>, res: IResponse<any>, next: NextFunction){
		try {
			res.json({
				message:'User login',
				data: await userService.userLogin(req.body)
			});
		} catch (error) {
			next(error);
		}
	}

	async userEdit(req: IRequest<IUserEdit>, res: IResponse<any>, next: NextFunction){
		// edit user
		await userService.editUser(req);
		res.json({
			message: 'User edited successfully!',
			data: {
				...req.body
			}
		});
	}

	async changePassword(req: IRequest<IChangePassword>, res: IResponse<any>, next: NextFunction){
		try {
			await userService.changePassword(req);
			res.json({
				message: "Password changed successfully!"
			});
		} catch (error) {
			next(error);
		}
	}

	async getUserDetail(req: IRequest, res: IResponse<IUser>, next: NextFunction){
		try {
			res.json({
				message: "User Detail",
				data: await usersSrevice.getUserDetail(req.user?.id || 0)
			});
		} catch (error) {
			next(error);
		}
	}

	async forgetPassword(req: IRequest<IForgetPassword>, res: IResponse<IUser>, next: NextFunction){
		try {
			await usersSrevice.forgetPassword(req.body.email);
			res.json({
				message: "Email sent successfully!"
			});
		} catch (error) {
			next(error);
		}
	}

}

export default new UsersController();