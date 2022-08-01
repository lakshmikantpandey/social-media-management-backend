import { z, ZodIssue } from "zod";

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
            username: z.string().min(2),
            email: z.string().email(),
            password: z.string().min(5),
            role: z.string().min(1)
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
            mobile: z.string().min(1),
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
            id: z.number().nonnegative(),
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
            channel_id: z.number().nonnegative()
        })
    }),
    userChannelTimezone: z.object({
        body: z.object({
            tz: z.string().min(1),
            channel_id: z.number().nonnegative()
        })
    }),
    getPages: z.object({
        params: z.object({
            social_type: z.string().min(1)
        })
    }),
    formatErrors: (errors: ZodIssue[]) => {
        return errors.map((error) => `${error.path[0]} - ${error.message}`);
    }
};