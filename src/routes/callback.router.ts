import { Router } from "express";
import { CallbackController } from "../controllers";

const callbackRouter = Router();

callbackRouter.get('/auth/linkedin/callback', CallbackController.linkedin);

export default callbackRouter;
