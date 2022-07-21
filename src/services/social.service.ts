import { nanoid } from "nanoid";
import { InternalServerError, NotFoundError } from "../errors";
import { IVerifyLinkedin } from "../interfaces";
import { Channel, UserChannel } from "../models";
import { Base64 } from "../utils";
import channelService from "./channels.service";
import { socialAccounts } from "./social_modules";


class SocialService {

    async getSocialLogin(social_type: string, State: number) {
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
            channel_type: 'Ln',
            channel_state: state
        });
        return socialAccounts[social_type].getAuth({ State: state });
    }

    async verifyLinkedIn(body:IVerifyLinkedin) {
        try {
            // get access token and user info
            const accessToken = await socialAccounts["Ln"].getAccessToken({ Code: body.code });
            const user = await socialAccounts["Ln"].getUser( { Token: accessToken.Token } );
            // DONE Save auth data in database table
            const auth = {
                id: user.id,
                first_name: user.FirstName,
                last_name: user.LastName,
                token: accessToken.Token
            };            
            // save linkedin setting to 
            await UserChannel.query().patch({
                settings: JSON.stringify(auth),
                expired_at: accessToken.ExpireDate,
                is_active: true
            }).where('channel_state',  decodeURIComponent(body.state));

            return {
                first_name: user.FirstName,
                last_name: user.LastName
            };

        } catch (error) {
            throw error;
        }
    }

}

export default new SocialService();