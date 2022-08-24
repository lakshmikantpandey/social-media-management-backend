import { nanoid } from "nanoid";
import { ref } from "objection";
import config from "../config";
import { ConflictError, NotFoundError, UnauthorizedError } from "../errors";
import { IFacebookPages, IRequest, ISelectedFacebookPage, ISelectedFacebookPages, ISocialType, IVerifyFacebook, IVerifyLinkedin } from "../interfaces";
import { Channel, UserChannel } from "../models";
import { Base64 } from "../utils";
import channelService from "./channels.service";
import { socialAccounts } from "./social_modules";


class SocialService {

    async getSocialLogin(social_type: string, State: string) {
        // validation
        const channel = await Channel.query().where('slug', social_type).andWhere('is_active', true).first();
        if(!channel) {
            throw new NotFoundError("Invalid Channel");
        }
        // create channel state for applied user
        const state = Base64.encode(nanoid(20)); // state code to trace current user applied to authenticate user
        await channelService.createChannelState({
            user_id: State,
            is_active: false,
            channel_type: social_type,
            channel_token: state,
            permissions: JSON.stringify(config.permissions),
            schedules: JSON.stringify(config.schedules),
            timezone: config.tz
        });
        return socialAccounts[social_type].getAuth({ State: state });
    }

    private async _isLinkedinAlreadyLinked(linkedinId: string, userId: any) {
        const linkedin = await UserChannel.query()
                        .where(ref('user_auth:id').castText(), linkedinId)
                        .andWhere('user_id', userId)
                        .andWhere("is_active", true);
        if(linkedin.length > 0){
            throw new ConflictError("This account is already linked");
        }
    }

    async verifyLinkedIn(body:IVerifyLinkedin, loggedInUser: any = "") {
        try {
            // get access token and user info
            const accessToken = await socialAccounts["Ln"].getAccessToken({ Code: body.code });
            const user = await socialAccounts["Ln"].getUser( { Token: accessToken.Token } );
            // DONE : validate before save in database
            await this._isLinkedinAlreadyLinked(user.id, loggedInUser);
            // DONE : Save auth data in database table
            const auth = {
                id: user.id,
                first_name: user.FirstName,
                last_name: user.LastName,
                token: accessToken.Token
            };
            // save linkedin setting to 
            await UserChannel.query().patch({
                user_auth: JSON.stringify(auth),
                expired_at: accessToken.ExpireDate,
                is_active: true
            }).where('channel_token',  decodeURIComponent(body.state));

            return {
                first_name: user.FirstName,
                last_name: user.LastName
            };

        } catch (error) {
            throw error;
        }
    }

    async verifyFacebook(body: IVerifyFacebook) {
        try {
            const accessToken = await socialAccounts["Fb"].getAccessToken({ Code: body.code });
            // save in database
            const auth = {
                id: "",
                first_name: "No page selected",
                last_name: "",
                token: accessToken.Token,
                pages: [],
                selected_page: {}
            };
            // In this query we replacing facebook redirect fragment string
            await UserChannel.query().patch({
                user_auth: JSON.stringify(auth),
                expired_at: accessToken.ExpireDate,
                is_active: true
            }).where('channel_token', decodeURIComponent(body.state.replace('#_=_', '')));
            return accessToken.Token ? true : false;
        } catch (error) {
            throw error;
        }
    }

    private async _getLatestSocialAccount(req: IRequest<any>) {
        return await UserChannel.query()
            .select(
                'id',
                'user_id',
                ref('user_auth:pages').castJson().as('pages'),
                ref('user_auth:token').castJson().as('token'),
                "channel_type"
            )
            .where('channel_type', req.params.social_type)
            .andWhere('is_active', true)
            .andWhere('user_id', req.user?.id || '')
            .orderBy('expired_at', 'DESC')
            .first().castTo<IFacebookPages>();
    }

    async getPages(req: IRequest<any>) {
        const socialAuth = await this._getLatestSocialAccount(req);
        if(!socialAuth) {
            throw new UnauthorizedError("Invalid token!");
        }
        // get pages
        const pageLists = await socialAccounts[req.params.social_type].getPages({
            Token: socialAuth.token
        });
        // DONE : save in user channel table
        if(pageLists.length > 0) {
            const channelPage = UserChannel.knex();
            await channelPage.raw(`update "user_channels" set "user_auth" = jsonb_set(to_jsonb("user_auth"), '{pages}', to_jsonb(?::text), true) where "id" = ?`, [
                JSON.stringify(pageLists),
                socialAuth.id || 0
            ]);
        }

        return pageLists.map((page) => {
            const { Name, Id, ProfilePicture } = page;
            return {
                Id, Name, ProfilePicture,
                channelId: socialAuth.id
            };
        });
    }

    async saveFacebookPage(body: ISelectedFacebookPage) {
        const socialPages = await UserChannel.query()
            .select('id', ref('user_auth:pages').castText().as('pages'))
            .where('id', body.userChannelId).castTo<ISelectedFacebookPages[]>();
        return socialPages;
    }

}

export default new SocialService();