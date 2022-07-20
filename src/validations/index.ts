import { z, ZodIssue } from "zod";
import { Channel } from "../models";


export const validateSchema = {
    createUser: () => z.object({
        first_name: z.string().min(2),
        username: z.string().min(2),
        email: z.string().email(),
        password: z.string().min(5),
        role: z.string().min(1)
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
    formatErrors: (errors: ZodIssue[]) => {
        return errors.map((error) => `${error.path[0]} - ${error.message}`);
    }
};