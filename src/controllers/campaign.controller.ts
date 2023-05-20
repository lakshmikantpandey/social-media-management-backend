import { NextFunction } from "express";
import { ICreateCampaign, ICreateCampaignBody, IEditCampaignBody, IRequest, IResponse } from "../interfaces";
import { ICampaignResBody } from '../interfaces/campaign.interface';
import { campaignService } from "../services";
import { ConvertToSlug } from "../utils";
import Controller from "./base.controller";

interface IDeleteCampaign {
    id?: string;
}

class CampaignController extends Controller {

    async getCampaigns(req: IRequest, res: IResponse<ICampaignResBody[]>) {
        const campaigns = await campaignService.getCampaigns(req);
        res.json({
            message: "Campaigns",
            data: campaigns
        });
    }

    async createCampaign(req: IRequest<ICreateCampaignBody>, res: IResponse<any>, next: NextFunction) {
        try {
            const body = req.body;
            // logged in user
            const campaignBody = {
                campaign_name: body.name,
                slug:  ConvertToSlug(body.name),
                color: body.color,
                user_id: req.user?.id
            };
            // call service
            const campaign = await campaignService.createCampaign(campaignBody);
            res.json({
                message: "Campaign Created!",
                data: campaign
            });
        } catch (error) {
            next(error);
        }
    }

    async editCampaign(req: IRequest<IEditCampaignBody>, res: IResponse<any>, next: NextFunction) {
        try {
            const body = req.body;
            // logged in user
            const campaignBody = {
                campaign_name: body.name,
                slug:  ConvertToSlug(body.name),
                color: body.color
            };
            // call service
            await campaignService.editCampaign(campaignBody, body.id);
            res.json({
                message: "Campaign edited successfully",
                data: body
            });
        } catch (error) {
            next(error);
        }
    }

    async deleteCampaign(req: IRequest<any, IDeleteCampaign, any>, res: IResponse<any>, next: NextFunction) {
        try {
            await campaignService.deleteCampaign(req.params?.id || '');
            res.json({
                message: "Campaign deleted successfully"
            });
        } catch (error) {
            next(error);
        }
    }

}

export default new CampaignController();