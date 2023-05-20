import { NotFoundError } from "../errors";
import { ICampaign, ICreateCampaign, IRequest } from "../interfaces";
import { ICampaignResBody } from '../interfaces/campaign.interface';
import { Campaign } from "../models";
import { MomentTZ } from "../utils";

class CampaignService {

    async getCampaigns(req: IRequest) : Promise<ICampaignResBody[]> {
        const campaign = Campaign.knex();
        const sql = `SELECT c.id, c.campaign_name, c.color, c.created_at, c.slug, count(pcm.post_id) scheduled_post from campaigns c LEFT JOIN posts_campaigns pc ON c.id = pc.campaign_id LEFT JOIN post_channels_map pcm ON pc.post_id = pcm.post_id AND pcm.post_date > NOW() AND c.user_id = '${req.user?.id}' AND c.deleted_at is null AND pcm.deleted_at is null group by c.id`;
        // const sql = `select c.id, c.campaign_name, c.slug, c.color,c.created_at,c.updated_at, count(p.id) as scheduled_post from campaigns c left join posts_campaigns pc on c.id = pc.campaign_id left join posts p on pc.post_id = p.id where p.publish_at is null and p.deleted_at is null and c.user_id = '${req.user?.id}' and c.deleted_at is null group by pc.campaign_id, c.id;`
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