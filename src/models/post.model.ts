import { Model, RelationMappings, RelationMappingsThunk } from 'objection';
import { BaseModel } from "./base.model";

export class PostCampaign extends BaseModel {
	static tableName = "posts_campaigns";
	static idColumn = 'id';

    static relationMappings: RelationMappings | RelationMappingsThunk = {
        posts: {
            relation: Model.HasOneRelation,
            modelClass: PostCampaign,
            filter: (query:any) => query.select('id','post_id','campaign_id'),
            join: {
                from: 'posts.id',
                to: 'posts_campaigns.post_id'
            }
        }
    };
}

export class PostFile extends BaseModel {
	static tableName = "posts_files";
	static idColumn = 'id';
}

export class PostChannelMap extends Model {
	static tableName = "post_channels_map";
	static idColumn = 'id';
}

export class Post extends BaseModel {
	static tableName = "posts";
	static idColumn = 'id';

	static relationMappings = {
		campaign : {
            relation: Model.HasOneRelation,
            modelClass: PostCampaign,
            filter: (query:any) => query.select('id','post_id','campaign_id'),
            join: {
                from: 'posts.id',
                to: 'posts_campaigns.post_id'
            }
        },
		channel_map: {
			relation: Model.HasManyRelation,
            modelClass: PostChannelMap,
            filter: (query:any) => query.select('id','post_id','campaign_id'),
            join: {
                from: 'posts.id',
                to: 'post_channels_map.post_id'
            }
		}
    }
}

export class PostCampaignMap extends BaseModel {
	static tableName = "posts_campaigns";
	static idColumn = 'id';

    static relationMappings: RelationMappings | RelationMappingsThunk = {
        posts: {
            relation: Model.HasManyRelation,
            modelClass: Post,
            // filter: (query:any) => query.select('id','post_id','campaign_id'),
            join: {
                from: 'posts_campaigns.post_id',
                to: 'posts.id',
            }
        }
    };
}