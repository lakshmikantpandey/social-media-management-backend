import { Router } from "express";
import { SocialController } from "../controllers";
import { jwtMiddleware, validSchema } from "../middlewares";
import { validateSchema } from "../validations";

const socialRoute = Router();

socialRoute.get("/social/get-social-login", [ validSchema(validateSchema.getSocialAccounts), jwtMiddleware ],  SocialController.getSocialLogin);
socialRoute.post("/social/verify-linkedin", [ validSchema(validateSchema.verifySocialAccount), jwtMiddleware ], SocialController.verifyLinkedin);
socialRoute.post("/social/verify-facebook", [ validSchema(validateSchema.verifySocialAccount), jwtMiddleware ], SocialController.verifyFacebook);
socialRoute.get("/social/get-facebook-pages/:social_type", [ validSchema(validateSchema.getPages), jwtMiddleware ], SocialController.getFacebookPages);
export default socialRoute;
