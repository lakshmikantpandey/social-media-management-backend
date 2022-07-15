import { Response, Request } from 'express';
import * as core from 'express-serve-static-core';
import { IJwtToken } from './common.interface';
import { z, ZodType } from "zod";

export interface IResponseBody<T> {
	message: string;
	errors?: string | string[];
	data?: T;
}

export type IResponse<T> = Response<IResponseBody<T>>;
export type IRequest <Body = unknown,Params =core.ParamsDictionary ,Query= qs.ParsedQs > = Request<Params extends ZodType?z.infer<Params>:Params, unknown,Body extends ZodType?z.infer<Body>:Body,Query extends ZodType?z.infer<Query>:Query>&IAuthUser;
export interface IAuthUser {
	user?: IJwtToken;
}
