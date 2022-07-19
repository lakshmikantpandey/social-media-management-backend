import { z, ZodIssue } from "zod";

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
    formatErrors: (errors: ZodIssue[]) => {
        return errors.map((error) => `${error.path[0]} - ${error.message}`);
    }
};