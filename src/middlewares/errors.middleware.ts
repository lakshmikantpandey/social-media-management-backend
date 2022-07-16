import { NextFunction, Request, Response } from 'express';
import { BaseError, ValidationError } from '../errors';
import multer from 'multer';
import { HttpCode } from '../enums';
import { logger } from '../logging';


export const errorHandlerMiddleware = (err: unknown, req: Request, res: Response, next: NextFunction) => {
	
	if (!err) {
		return next();
	}
	
	logger.log('error', err);
	// Schema validation error.
	if (err instanceof ValidationError) {
		res.status(err.status).json({
			message:err.message,
			errors: err.errors
		});

	}else if (err instanceof multer.MulterError) {
		res.status(HttpCode.UnsupportedMediaType).json({
			message:"Invalid file",
			errors:err.message
		});
	}else if (err instanceof BaseError) {
		res.status(err.status).json({
			message:err.type,
			errors:err.message
		});
	}else if (err instanceof Error) {
		res.status(HttpCode.InternalServerError).json({
			message:"Internal server error!",
			errors: (err as Error).message
		});
	}
};