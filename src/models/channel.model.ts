import { BaseModel } from "./base.model";

export class Channel extends BaseModel {
    static tableName = "channels";
    static idColumn = 'id';
}

export class UserChannel extends BaseModel {
    static tableName = "user_channels";
    static idColumn = 'id';
}

