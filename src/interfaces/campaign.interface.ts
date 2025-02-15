export interface ICampaign {
    id: number;
    user_id?: string;
    campaign_name?: string;
    slug?: string;
    color: string;
    deleted_at?: Date | string;
    created_at?: Date| string;
    updated_at?: Date | string;
}

export type ICampaignResBody = Omit<ICampaign, "deleted_at" | "user_id">;

export interface ICreateCampaignBody {
    name: string;
    color: string;
}

export interface IEditCampaignBody extends ICreateCampaignBody {
    id: string;
}

export type ICreateCampaign = Pick<ICampaign, "color" | "slug" | "user_id" | "campaign_name">;


export interface ICampaignPostDeleteBody {
    campaign_id: string;
    post_id: string;
}