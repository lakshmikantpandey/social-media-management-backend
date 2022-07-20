import { Router } from "express";
import { SocialController } from "../controllers";
import { jwtMiddleware, validSchema } from "../middlewares";
import { validateSchema } from "../validations";

const socialRoute = Router();

socialRoute.get("/social/get-social-login", [validSchema(validateSchema.getSocialAccounts), jwtMiddleware],  SocialController.getSocialLogin);

export default socialRoute;