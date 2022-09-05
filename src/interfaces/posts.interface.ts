
export interface PostImage {
	file_path: string;
	file_type: string;
}

export interface ICreatePost {
	post_description: string;
	channel_id?: string[];
	timezone: string | undefined;
	post_date: any;
	is_draft: boolean;
	is_apprived?: boolean;
	hashtag: string;
	post_images?: PostImage[];
	user_id?: string;
	campaign_id?: string;
}

export interface IEditPost extends ICreatePost {
	post_id: string;
}

export interface IPost extends ICreatePost {
	id: string;
	deleted_at?: Date;
	created_at?: Date;
	updated_at?: Date;
}

export interface IPostCampaign {
	id: string;
	post_id: string;
	campaign_id: string | undefined;
	created_at?: Date;
	updated_at?: Date;
	deleted_at?: Date;
}

export type IPostCampaignBody = Omit<IPostCampaign, "created_at" | "updated_at" | "deleted_at" | "id">;
