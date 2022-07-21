import { IRequest, IResponse } from "./response.interface";
import { IUserLogin, IUserRegister, IUser, IUserVerifyToken, IUserEdit, IChangePassword, IForgetPassword } from "./user.interface";
import { IJwtToken } from "./common.interface";
import { IChannel, IUserChannel, IAssignChannel, IRemoveChannel, IChannelState } from "./channel.interface";
import { ISocialType, IVerifyLinkedin } from "./social.interface";
import { ICampaign, ICreateCampaign, ICreateCampaignBody, IEditCampaignBody } from "./campaign.interface";

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
	ISocialType,
	IVerifyLinkedin,
	IChannelState,
	ICampaign,
	ICreateCampaign,
	ICreateCampaignBody,
	IEditCampaignBody
};
