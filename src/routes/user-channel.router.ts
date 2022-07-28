import { Router } from "express";

import { UserChannelController } from "../controllers";
import { jwtMiddleware, validSchema } from "../middlewares";
import { validateSchema } from "../validations";

const userChannelRouter = Router();

userChannelRouter.put("/user-channel/update-schedules", [ validSchema(validateSchema.userChannelSchedules), jwtMiddleware] , UserChannelController.updateSchedules);
userChannelRouter.put("/user-channel/update-timezone", [ validSchema(validateSchema.userChannelTimezone), jwtMiddleware] , UserChannelController.updateTimezone);

export default userChannelRouter;