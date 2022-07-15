export interface IJwtToken {
	id: number;
	mobile: string;
	role: string;
	token_id: string;
	tz?: string;
	exp: number;
	iat: number;
	iss: string;
}

export interface IQueryModel {
	findById<T>(arg: T): T;
}