import { NextFunction, Request, Response } from "express";
import Controller from "./base.controller";

const ENV = process.env;

class CallbackController extends Controller {

	linkedin(req: Request, res: Response) {
		const query = req.query;
		res.redirect(`${ENV.LINKEDIN_WEB_REDIRECT}?code=${query.code}&state=${query.state}`);
	}

	facebook(req: Request, res: Response) {

	}

}

const callbackController = new CallbackController();

export default callbackController;