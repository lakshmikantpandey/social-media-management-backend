import { BaseModel } from "./base.model";

export class Campaign extends BaseModel {
    static tableName = 'campaigns';
	static idColumn = 'id';
}