import { IRequest, IResponse } from "../interfaces";
import Controller from "./base.controller";

class UsersController extends Controller {
	sayHello(req: IRequest, res: IResponse<any>) {
		res.json({
			message: "Success",
		});
	}

	createUser(req: IRequest, res: IResponse<any>) {
		
	}
}

export default new UsersController();