import { Router } from 'express';
import { uploadImage, postsController } from '../controllers/posts.controller';
import { jwtMiddleware, validSchema } from '../middlewares';
import { validateSchema } from '../validations';

const postRouter = Router();
postRouter.use(jwtMiddleware);

postRouter.get("/posts", postsController.getAllPosts);
postRouter.get("/posts/:id", postsController.getPostDetail);
postRouter.post("/posts", [validSchema(validateSchema.createPost)], postsController.createPost);
postRouter.put("/posts", [validSchema(validateSchema.editPost)], postsController.editPost);
postRouter.delete("/posts/:post_id", [validSchema(validateSchema.deletePost)], postsController.deletePost);
postRouter.delete("/campaign-post/:campaign_id/:post_id", [ validSchema(validateSchema.campaignPostDelete) ], postsController.deleteCampaignPosts);
postRouter.get("/posts/channel/:channel_id", [validSchema(validateSchema.getPostByChannel)], postsController.getPostsByChannel);
postRouter.get("/posts/campaign/:campaign_id", [validSchema(validateSchema.getPostByCampaign)], postsController.getPostByCampaign);
postRouter.post("/posts/upload-files", [uploadImage], postsController.uplaodFiles);

export default postRouter;