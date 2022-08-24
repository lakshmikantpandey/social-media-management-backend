import { Model } from 'objection';
import { BaseModel } from "./base.model";

export class Channel extends BaseModel {
    static tableName = "channels";
    static idColumn = 'id';
}

export class UserChannel extends BaseModel {
    static tableName = "user_channels";
    static idColumn = "id";

    static relationMappings = {
        channel : {
            relation: Model.BelongsToOneRelation,
            modelClass: Channel,
            filter: (query:any) => query.select('id','channel','slug','image'),
            join: {
                from: 'user_channels.channel_type',
                to: 'channels.slug'
            }
        }
    }
}

