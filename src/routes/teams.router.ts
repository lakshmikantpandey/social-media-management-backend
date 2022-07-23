import { Router } from "express";
import { TeamsController } from "../controllers";
import { jwtMiddleware, validSchema } from "../middlewares";
import { validateSchema } from "../validations";

const teamsRouter = Router();

teamsRouter.post('/teams/invite-member', [ validSchema(validateSchema.inviteMember), jwtMiddleware ], TeamsController.inviteMember);
teamsRouter.post('/teams/verify', [ validSchema(validateSchema.verifyMember) ], TeamsController.verifyInvitation);

export default teamsRouter;