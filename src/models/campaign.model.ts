import { Model, RelationMappings, RelationMappingsThunk } from "objection";
import { BaseModel } from "./base.model";
import { Post, PostCampaign } from "./post.model";

export class Campaign extends BaseModel {
    static tableName = 'campaigns';
	static idColumn = 'id';

    static relationMappings: RelationMappings | RelationMappingsThunk = {
        campaignPost: {
            relation: Model.HasOneRelation,
            modelClass: PostCampaign,
            join: {
                from: 'campaigns.id',
                to: 'posts_campaigns.campaign_id'
            }
        }
    };
}