export interface IChannel {
    id: number;
    channel: string;
    slug: string;
    image?: string;
    created_at?: Date | string;
    updated_at?: Date | string;
}
