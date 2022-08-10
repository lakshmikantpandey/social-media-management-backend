import { UsersController } from "../controllers";
import { Router } from "express";
import { jwtMiddleware, validSchema } from "../middlewares";
import { validateSchema } from "../validations";

const usersRouter = Router();
usersRouter.post('/users/register', validSchema(validateSchema.registerUser) , UsersController.createUser);
usersRouter.post('/users/forget-password', validSchema(validateSchema.forgetPassword) , UsersController.forgetPassword);
usersRouter.get('/users/verify-user', validSchema(validateSchema.verifyUserToken), UsersController.verifyUser);
usersRouter.post('/users/login', validSchema(validateSchema.userLogin), UsersController.userLogin);
usersRouter.put('/users/edit', [validSchema(validateSchema.userEdit), jwtMiddleware] , UsersController.userEdit);
usersRouter.put('/users/change-password', [ validSchema(validateSchema.changePassword), jwtMiddleware] , UsersController.changePassword);
usersRouter.get('/users/get-detail', [ jwtMiddleware ] , UsersController.getUserDetail);

export default usersRouter;