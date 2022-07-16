import { Request, Response, NextFunction } from "express";
import { AnyZodObject } from "zod";
import { HttpCode } from "../enums";
import { ValidationError } from "../errors";
import { validateSchema } from "../validations";

export const validSchema = (schema: AnyZodObject) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        // validate
        const validate = await schema.safeParseAsync({
            body: req.body,
            query: req.query,
            params: req.params
        });
        if(!validate.success){
            return res.status(HttpCode.UnprocessableEntity).json({
                message:'Validation Error',
                errors: validate.error.errors
                // errors: validateSchema.formatErrors(validate.error.errors)
            });
        }
        next();
    }
}