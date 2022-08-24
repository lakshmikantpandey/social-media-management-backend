import { Router } from "express";
import { CampaignController } from "../controllers";
import { jwtMiddleware, validSchema } from "../middlewares";
import { validateSchema } from "../validations";

const campaignRouter = Router();

campaignRouter.get("/campaigns", [ jwtMiddleware ] , CampaignController.getCampaigns);
campaignRouter.post("/campaign", [ validSchema(validateSchema.createCampaign), jwtMiddleware ] , CampaignController.createCampaign);
campaignRouter.put("/campaign", [ validSchema(validateSchema.editCampaign), jwtMiddleware ] , CampaignController.editCampaign);
campaignRouter.delete("/campaign/:id", [ validSchema(validateSchema.deleteCampaign), jwtMiddleware ] , CampaignController.deleteCampaign);

export default campaignRouter;