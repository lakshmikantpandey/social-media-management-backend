import { number, z, ZodIssue } from "zod";

const ROLES = ["creator", "sub-creator"] as const;



export const validateSchema = {
    createUser: () => z.object({
        first_name: z.string().min(2),
        username: z.string().min(2),
        email: z.string().email(),
        password: z.string().min(5),
        role: z.enum(ROLES)
    }),
    registerUser: z.object({
        body: z.object({
            first_name: z.string().min(2),
            email: z.string().email(),
            password: z.string().min(5)
        })
    }),
    verifyUserToken: z.object({
        query: z.object({
            token: z.string().min(1)
        })
    }),
    userLogin: z.object({
        body: z.object({
            username: z.string().min(1),
            password: z.string().min(1)
        })
    }),
    userEdit: z.object({
        body: z.object({
            first_name: z.string().min(2),
            last_name: z.string()
        })
    }),
    changePassword: z.object({
        body: z.object({
            old_password: z.string().min(1),
            new_password: z.string().min(1)
        })
    }),
    forgetPassword: z.object({
        body: z.object({
            email: z.string().email(),
        })
    }),
    assignChannel: z.object({
        body: z.object({
            channel_type: z.string(),
            settings: z.object({ token: z.string().min(1), id: z.string() })
        })
    }),
    removeChannel: z.object({
        params: z.object({
            id: z.any()
        })
    }),
    getSocialAccounts: z.object({
        query: z.object({
            social_type: z.string().min(1)
        })
    }),
    verifySocialAccount: z.object({
        body: z.object({
            code: z.string().min(1),
            state: z.string().min(1)
        })
    }),
    createCampaign: z.object({
        body: z.object({
            name: z.string().min(1),
            color: z.string().min(1)
        })
    }),
    editCampaign: z.object({
        body: z.object({
            id: z.any(),
            name: z.string().min(1),
            color: z.string().min(1)
        })
    }),
    deleteCampaign: z.object({
        params: z.object({
            id: z.string().min(1),
        })
    }),
    inviteMember: z.object({
        body: z.object({
            first_name: z.string().min(1),
            email: z.string().email(),
            admin_access: z.boolean(),
            channels: z.array(z.object({
                channel: z.number(),
                access_level: z.enum(["full_posting_access", "approval_required"])
            })).nonempty()
        })
    }),
    verifyMember: z.object({
        body: z.object({
            password: z.string().min(1),
            token: z.string().min(1)
        })
    }),
    userChannelSchedules: z.object({
        body: z.object({
            arg: z.string().min(1),
            channel_id: z.string().min(1)
        })
    }),
    userChannelTimezone: z.object({
        body: z.object({
            tz: z.string().min(1),
            channel_id: z.string().min(1)
        })
    }),
    getPages: z.object({
        params: z.object({
            social_type: z.string().min(1)
        })
    }),
    savePage: z.object({
        body: z.object({
            pageIndex: z.number().nonnegative(),
            userChannelId: z.number().nonnegative()
        })
    }),
    postingSchedule: z.object({
        params: z.object({
            id: z.string().uuid()
        })
    }),
    createPost: z.object({
        body: z.object({
            post_images: z.array(z.object({
                file_path: z.string().min(1),
                file_type: z.string().min(1)
            })).nonempty(),
            post_description : z.string().min(1),
            post_date: z.string().min(1),
            is_draft: z.boolean(),
            hashtag: z.array(z.string().min(1)),
            channel_id: z.array(z.string().uuid()),
            campaign_id: z.string().uuid().optional()
        })
    }),
    editPost: z.object({
        body: z.object({
            post_id: z.string().uuid(),
            post_images: z.array(z.object({
                file_path: z.string().min(1),
                file_type: z.string().min(1)
            })).nonempty(),
            post_description : z.string().min(1),
            post_date: z.string().min(1),
            is_draft: z.boolean(),
            hashtag: z.array(z.string().min(1)),
            channel_id: z.array(z.string().uuid()),
            campaign_id: z.string().uuid().optional()
        })
    }),
    deletePost: z.object({
        params: z.object({
            post_id: z.string().uuid()
        })
    }),
    formatErrors: (errors: ZodIssue[]) => {
        return errors.map((error) => `${error.path[1]} - ${error.message}`);
    }
};