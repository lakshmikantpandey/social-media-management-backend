import { BaseModel } from "./base.model";

export class User extends BaseModel {
    static tableName = 'users';
	static idColumn = 'id';
}