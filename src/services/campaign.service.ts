import { NotFoundError } from "../errors";
import { ICampaign, ICreateCampaign, IRequest } from "../interfaces";
import { ICampaignResBody } from '../interfaces/campaign.interface';
import { Campaign } from "../models";
import { MomentTZ } from "../utils";

class CampaignService {

    async getCampaigns(req: IRequest) : Promise<ICampaignResBody[]> {
        return await Campaign.query()
            .select("id", "campaign_name", "slug", "color", "created_at", "updated_at")
            .where('user_id', req.user?.id || 0)
            .andWhere('deleted_at', null).castTo<ICampaignResBody[]>();
    }

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
            if(!campaign) {
                throw new NotFoundError("Invalid Campaign");
            }
            await Campaign.query().findById(id).patch({
                deleted_at: new Date()
            });
        } catch (error) {
            throw error;
        }
    }

}

export default new CampaignService();