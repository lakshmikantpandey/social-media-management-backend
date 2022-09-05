import { Request, Response, NextFunction } from "express";
import { AnyZodObject, z, ZodSchema } from "zod";
import { HttpCode } from "../enums";
import { ValidationError } from '../errors';
import { validateSchema } from '../validations';

export const validSchema = (schema: AnyZodObject) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const validate = await schema.safeParseAsync({
            body: req.body,
            query: req.query,
            params: req.params
        });
        if(!validate.success){
            return res.status(HttpCode.UnprocessableEntity).json({
                message:'Validation Error',
                // errors: validate.error.errors
                errors: validateSchema.formatErrors(validate.error.errors)
            });
        }
        next();
    }
}

export const validateInsideSchema = async (schema: AnyZodObject, body: any) => {
    try {
        schema.parse({
            body: body
        });
        return true;
    } catch (err) {
        if (err instanceof z.ZodError) {
            throw new ValidationError("Validation Error", err.issues);
        }
    }
}