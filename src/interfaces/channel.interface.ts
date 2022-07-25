export interface IChannel {
    id: number;
    channel: string;
    slug: string;
    image?: string;
    created_at?: Date | string;
    updated_at?: Date | string;
}

interface ISettings {
    id: string;
    token: string;
}

export interface IUserChannel {
    user_id: number;
    channel_type: string;
    settings: ISettings;
    expired_at?: Date | string;
    is_active: boolean;
    channel_token?: string;
    permissions?: string;
    schedules?: string;
    timezone?: string;
    deleted_at?: Date | string;
    created_at?: Date | string;
    updated_at?: Date | string;
}

export type IAssignChannel = Pick<IUserChannel, "channel_type" | "settings" | "expired_at" | "is_active" | "channel_token" | "timezone">;
export type IRemoveChannel = Pick<IChannel, "id">;
export type IChannelState =  Pick<IUserChannel, "user_id" | "channel_type" | "channel_token" | "is_active" | "permissions" | "schedules" | "timezone">;
