import { Router } from "express";
import { SocialController } from "../controllers";
import { jwtMiddleware, validSchema } from "../middlewares";
import { validateSchema } from "../validations";

const socialRoute = Router();

socialRoute.get("/social/get-social-login", [ validSchema(validateSchema.getSocialAccounts), jwtMiddleware ],  SocialController.getSocialLogin);
socialRoute.post("/social/verifyLinkedin", [ validSchema(validateSchema.verifySocialAccount), jwtMiddleware ], SocialController.verifyLinkedin);
// socialRoute.post("/verifyFacebook", [ validSchema(validateSchema.verifySocialAccount), jwtMiddleware ], SocialController.verifyFacebook);
socialRoute.get('/verifyFacebook', SocialController.verifyFacebook);
socialRoute.get("/social/get-facebook-pages/:social_type", [ validSchema(validateSchema.getPages), jwtMiddleware ], SocialController.getFacebookPages);
socialRoute.put("/social/save-social-page", [ validSchema(validateSchema.savePage), jwtMiddleware ], SocialController.saveFacebookPage);
export default socialRoute;
