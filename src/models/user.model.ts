import { BaseModel } from "./base.model";
import { Team } from "./team.model";

export class User extends BaseModel {
    static tableName = 'users';
	static idColumn = 'id';

    static relationMappings = {
        teams: {
            relation: BaseModel.BelongsToOneRelation,
            modelClass: Team,
            join: {
                from: "users.id",
                to: "teams.user_id"
            }
        }
    }
}