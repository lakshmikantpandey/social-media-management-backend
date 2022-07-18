export interface IUser {
	id?: number;
	first_name: string;
	last_name: string;
	email: string;
	username: string;
	password: string;
	mobile: string;
	role: string;
	is_active: boolean;
	is_deleted: boolean;
	deleted_at?: Date | string;
	created_at?: Date | string;
	updated_at?: Date | string;
}

export type IUserLogin = Pick<IUser, "username" | "password">;

export type IUserRegister = Omit<IUser, "is_deleted" | "is_active">;

export type IUserVerifyToken = Pick<IUser, "id" | "email">;