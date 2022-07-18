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
    formatErrors: (errors: ZodIssue[]) => {
        return errors.map((error) => `${error.path[0]} - ${error.message}`);
    }
};