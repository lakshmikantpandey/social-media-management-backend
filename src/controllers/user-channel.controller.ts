import { NextFunction } from "express";
import { IRequest, IResponse } from "../interfaces";
import Controller from "./base.controller";

class UserChannelController extends Controller {
    
    // TODO
    updateSchedules(req: IRequest<any>, res: IResponse<any>, next: NextFunction) {

    }

    // TODO
    updateTimezone(req: IRequest<any>, res: IResponse<any>, next: NextFunction) {

    }

}

export default new UserChannelController();