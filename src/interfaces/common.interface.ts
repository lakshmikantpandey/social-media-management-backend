export interface IJwtToken {
	id: string;
	first_name: string;
	last_name?: string;
	role: string;
	email: string;
	tz?: string;
	exp: number;
	iat: number;
	iss: string;
}