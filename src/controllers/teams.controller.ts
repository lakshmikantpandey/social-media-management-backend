import { NextFunction } from "express";
import { IInviteMember, IRequest, IResponse } from "../interfaces";
import { teamsService } from "../services";
import Controller from "./base.controller";

class TeamsController extends Controller {

    async inviteMember(req: IRequest<IInviteMember>, res: IResponse<any>, next: NextFunction) {
        try {
            const body = req.body;
            const team = await teamsService.inviteMember({
                ...body,
                parent_id: req.user?.id
            });
            res.json({
                data: team,
                message: 'member invited'
            });
        } catch (error) {
            next(error);
        }
    }

}

export default new TeamsController();