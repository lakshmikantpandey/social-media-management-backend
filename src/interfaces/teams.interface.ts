
export interface IChannel {
    channel: number;
    access_level: string;
}

export interface IInviteMember {
    first_name: string;
    last_name?: string;
    email: string;
    admin_access: boolean;
    channels: IChannel[];
}

export interface IVerifyMember {
    token: string;
    password: string;
}