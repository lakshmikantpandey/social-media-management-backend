import { BaseModel } from "./base.model";

export class Channel extends BaseModel {
    static tableName = "channels";
    static idColumn = 'id';
}