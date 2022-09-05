import { Router } from 'express';
import postsController, { uploadImage } from '../controllers/posts.controller';
import { jwtMiddleware, validSchema } from '../middlewares';
import { validateSchema } from '../validations';

const postRouter = Router();

postRouter.get("/posts", [jwtMiddleware], postsController.getAllPosts);
postRouter.post("/posts", [jwtMiddleware, validSchema(validateSchema.createPost)], postsController.createPost);
postRouter.put("/posts", [jwtMiddleware, validSchema(validateSchema.editPost)], postsController.editPost);
postRouter.delete("/posts/:post_id", [jwtMiddleware, validSchema(validateSchema.deletePost)], postsController.deletePost);
postRouter.post("/posts/upload-files", [jwtMiddleware, uploadImage], postsController.uplaodFiles);

export default postRouter;