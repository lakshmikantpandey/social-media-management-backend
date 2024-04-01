import { NotFoundError } from "../errors";
import { ICampaign, ICreateCampaign, IRequest } from "../interfaces";
import { ICampaignResBody } from '../interfaces/campaign.interface';
import { Campaign } from "../models";
import { MomentTZ } from "../utils";

class CampaignService {

    async getCampaigns(req: IRequest) : Promise<ICampaignResBody[]> {
        const campaign = Campaign.knex();
        const sql = `SELECT * FROM campaigns WHERE deleted_at IS NULL`;
        // const sql = `SELECT c.id,c.campaign_name,c.color,c.created_at,c.slug,COUNT(pcm.post_id) AS scheduled_post FROM campaigns c LEFT JOIN posts_campaigns pc ON c.id = pc.campaign_id LEFT JOIN post_channels_map pcm ON pc.post_id = pcm.post_id AND pcm.post_date > NOW() AND c.user_id = '${req.user?.id}' AND pcm.deleted_at IS NULL WHERE c.deleted_at IS NULL AND pc.campaign_id IS NOT NULL AND pcm.post_id IS NOT NULL GROUP BY c.id;`;
        const campaigns = await campaign.raw(sql);
        return campaigns.rows;
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

    async getCampaignById(campaign_id: string) : Promise<ICampaign> {
        return await Campaign.query().where("id", campaign_id).first().castTo<ICampaign>();
    }

}

export default new CampaignService();