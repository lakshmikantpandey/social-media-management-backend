import { Router } from "express";
import { TimezoneController } from "../controllers";

const timezoneRouter = Router();

timezoneRouter.get("/timezones", TimezoneController.getTimezones);

export default timezoneRouter;