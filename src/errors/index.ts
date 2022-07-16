import { HttpCode } from '../enums';


export class BaseError extends Error{
	type:string="Internal Server Error";
	constructor(message: string, public status: number){
		super(message);
	}
}

export class ValidationError extends BaseError {
	type:string="Validation Error";
	constructor(message: string, public errors: any|any[], public status: number = HttpCode.UnprocessableEntity){
		super(message, status);
	}
};

export class InternalServerError extends BaseError {
	type:string="Internal Server Error";
	constructor(message: string, public errors: any|any[], public status: number = HttpCode.InternalServerError){
		super(message, status);
	}
};

export class NotFoundError extends BaseError{
	type:string="Not Found";
	constructor(message: string, public status: number = HttpCode.NotFound){
		super(message,status);
	}
};

export class UnauthorizedError extends BaseError{
	type:string="Unauthorized";
	constructor(message: string, public status: number = HttpCode.Unauthorized){
		super(message,status);
	}
}

export class ConflictError extends BaseError {
	type:string="Conflict";
	constructor(message: string, public status: number = HttpCode.Conflict){
		super(message,status);
	}
}

// invalid file type
export class InvalidFileTypeError extends BaseError {
	type:string="Invalid File";
	constructor(msg: string, public status: number = HttpCode.UnsupportedMediaType){
		super(msg,status);
	}
}