import { Router } from "express";
import { TeamsController } from "../controllers";
import { jwtMiddleware, validSchema } from "../middlewares";
import { validateSchema } from "../validations";

const teamsRouter = Router();

teamsRouter.post('/teams/invite-member', [ validSchema(validateSchema.inviteMember), jwtMiddleware ], TeamsController.inviteMember);

export default teamsRouter;