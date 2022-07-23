import { NextFunction } from "express";
import { jwtHelper } from "../helpers";
import { IInviteMember, IRequest, IResponse, IVerifyMember } from "../interfaces";
import { teamsService } from "../services";
import Controller from "./base.controller";

class TeamsController extends Controller {

    // DONE : verification for user pending
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

    async verifyInvitation( req: IRequest<IVerifyMember>, res: IResponse<any>, next: NextFunction ){
        try {
            await teamsService.verifyMember(req.body);
            res.json({
                message: "Invitation verified"
            });
        } catch (error) {
            next(error);
        }
    }

}

export default new TeamsController();