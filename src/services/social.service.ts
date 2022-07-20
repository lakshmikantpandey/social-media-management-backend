import { NotFoundError } from "../errors";
import { Channel } from "../models";
import channelsService from "./channels.service";
import { socialAccounts } from "./social_modules";


class SocialService {

    async getSocialLogin(social_type: string, State: number) {
        // validation
        const channel = await Channel.query().where('slug', social_type).andWhere('is_active', true).first();
        if(!channel) {
            throw new NotFoundError("Invalid Channel");
        }
        return socialAccounts[social_type].getAuth({ State: State });
    }

}

export default new SocialService();