import { IRequest, IResponse, IUserRegister } from "../interfaces";
import Controller from "./base.controller";

class UsersController extends Controller {
	sayHello(req: IRequest, res: IResponse<any>) {
		res.json({
			message: "Success",
		});
	}

	createUser(req: IRequest<IUserRegister>, res: IResponse<any>) {
		const body = req.body;
	}
}

export default new UsersController();