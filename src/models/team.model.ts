import { BaseModel } from "./base.model";

export class Team extends BaseModel {
    static tableName = "teams";
    static idColumn = 'id';
}