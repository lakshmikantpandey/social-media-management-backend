import { IPostCampaignBody } from '../interfaces/posts.interface';
import { PostCampaign } from '../models';


class PostCampaignService {
	async savePostCampaign(body: IPostCampaignBody) {
		await PostCampaign.query().insert(body);
	}
}

export default new PostCampaignService();