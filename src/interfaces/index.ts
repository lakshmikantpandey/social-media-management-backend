import { IRequest, IResponse } from "./response.interface";
import { IUserLogin, IUserRegister, IUser, IUserVerifyToken, IUserEdit, IChangePassword, IForgetPassword } from "./user.interface";
import { IJwtToken } from "./common.interface";
import { IChannel, IUserChannel, IAssignChannel, IRemoveChannel } from "./channel.interface";
import { ISocialType } from "./social.interface";

export {
	IRequest,
	IResponse,
	IUser,
	IUserLogin,
	IUserRegister,
	IJwtToken,
	IUserVerifyToken,
	IUserEdit,
	IChangePassword,
	IForgetPassword,
	IChannel,
	IUserChannel,
	IAssignChannel,
	IRemoveChannel,
	ISocialType
};