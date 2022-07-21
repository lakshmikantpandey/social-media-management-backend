import { NotFoundError } from "../errors";
import { ICampaign, ICreateCampaign } from "../interfaces";
import { Campaign } from "../models";
import { MomentTZ } from "../utils";

class CampaignService {

    async createCampaign(body: ICreateCampaign) : Promise<ICampaign> {
        try {
            return await Campaign.query().insert(body).castTo<ICampaign>();            
        } catch (error) {
            throw error;
        }
    }

    async editCampaign( body: Omit<ICreateCampaign, "user_id">, id: string ) {
        try {
            await Campaign.query().findById(id).patch(body); 
        } catch (error) {
            throw error;
        }
    }

    async deleteCampaign(id: string) {
        try {
            // check campaign exists
            const campaign = await Campaign.query().findById(id).where('deleted_at', null).first();
            console.log(campaign);
            
            if(!campaign) {
                throw new NotFoundError("Invalid Campaign");
            }
            await Campaign.query().findById(id).patch({
                deleted_at: MomentTZ().format("YYYY-MM-DD")
            });
        } catch (error) {
            throw error;
        }
    }

}

export default new CampaignService();