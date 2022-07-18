import { UsersController } from "../controllers";
import { Router } from "express";
import { validSchema } from "../middlewares";
import { validateSchema } from "../validations";

const usersRouter = Router();
usersRouter.post('/users/register', validSchema(validateSchema.registerUser) , UsersController.createUser);
usersRouter.get('/users/verify-user', validSchema(validateSchema.verifyUserToken), UsersController.verifyUser);

export default usersRouter;