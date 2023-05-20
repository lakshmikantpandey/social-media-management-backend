import { NextFunction } from 'express';
import moment from 'moment';

import Controller from './base.controller';
import { IRequest, IResponse } from '../interfaces';
import { uploadImages } from '../helpers/spaces.helper';
import { IBucketFile } from "../interfaces";
import { ConflictError, NotFoundError } from '../errors';
import { campaignService, postService, userChannelService } from "../services";
import { ICreatePost, IEditPost, IGetPostByChannel, IGetPostByChannelFilter, ISearchPosts } from '../interfaces/posts.interface';
import { Post } from '../models';
import { socialAccounts } from '../services/social_modules';
import { ICampaignPostDeleteBody } from '../interfaces/campaign.interface';

export const uploadImage = uploadImages.array('upload_files', 5);

class PostsController extends Controller {

	async getPostDetail(req: IRequest<any>, res: IResponse<any>, next: NextFunction) {
		try {
			const postDetail = await postService.getPostById(req);
			res.json({
				message: "Post",
				data: postDetail
			})
		} catch (error) {
			next(error);
		}
	}

	async getAllPosts(req: IRequest<any, any, ISearchPosts>, res: IResponse<any>, next: NextFunction) {
		try {
			const posts = await postService.getAllPosts(req);
			if (moment(req.query.start).isAfter(moment(req.query.end))) {
				throw new ConflictError("Invalid date range");
			}
			res.json({
				message: "Posts scheduled",
				data: posts.map((post: any) => {
					return {
						id: post.id,
						post_date: moment(post.post_date).tz(post.timezone).format("YYYY-MM-DD HH:mm"),
						timezone: post.timezone,
						post_description: post.post_description,
						channel_id: post.channel_id
					};
				})
			});
		} catch (error) {
			next(error);
		}
	}

	async createPost(req: IRequest<ICreatePost>, res: IResponse<any>, next: NextFunction) {
		try {
			const body = req.body;
			const connectedChannel = await userChannelService.getConnectedChannel(req.user?.id || '0');
			// check if id exists in connected channels
			const channels = connectedChannel.map(channel => channel.id);
			let isValidChannel: boolean = true;
			// post date validation
			for (const channel of body.channel_id || []) {
				if (channels.indexOf(<string>channel) == -1) {
					isValidChannel = false;
					break;
				}
			}
			if (!isValidChannel) {
				throw new NotFoundError("Invalid channel is trying to connect");
			}
			if (body.campaign_id !== undefined) {
				const campaign = await campaignService.getCampaignById(body.campaign_id || "");
				if (campaign?.deleted_at != null || campaign == undefined) {
					throw new NotFoundError("Invalid selected campaign");
				}
			}
			// create posts
			body.hashtag = JSON.stringify(body.hashtag);
			body.post_files = JSON.stringify(body.post_files);
			body.user_id = req.user?.id;
			body.is_draft = body.is_draft;
			const post = await postService.createPost(body);
			// share post
			// if(!body.is_scheduled){
			// 	postService.sharePost(body);
			// }
			res.json({
				message: "Post created successfully!",
				data: post
			});
		} catch (error) {
			next(error);
		}
	}

	async editPost(req: IRequest<IEditPost>, res: IResponse<any>, next: NextFunction) {
		try {

			const body = req.body;
			const postFound = await Post.query().findById(body.post_id);
			if (postFound == undefined) {
				throw new NotFoundError("Invalid Post");
			}

			const connectedChannel = await userChannelService.getConnectedChannel(req.user?.id || '0');
			// check if id exists in connected channels
			const channels = connectedChannel.map(channel => channel.id);
			for (const channel of body.channel_id || []) {
				if (channels.indexOf(<string>channel) == -1) {
					throw new NotFoundError("Invalid channel is trying to connect");
				}
			}
			if (body.campaign_id !== undefined) {
				const campaign = await campaignService.getCampaignById(body.campaign_id || "");
				if (campaign?.deleted_at != null || campaign == undefined) {
					throw new NotFoundError("Invalid selected campaign");
				}
			}
			await postService.editPost(body);
			res.json({
				message: "Post updated successfully!"
			});
		} catch (error) {
			next(error);
		}
	}

	async deletePost(req: IRequest<any, { post_id: string }, any>, res: IResponse<any>, next: NextFunction) {
		try {
			// check if post available
			await postService.deletePost(req.params.post_id);
			res.json({
				message: "Post deleted successfully!",
				data: req.params.post_id
			});
		} catch (error) {
			next(error);
		}
	}

	async uplaodFiles(req: IRequest, res: IResponse<any>, next: NextFunction) {
		try {
			const files = <IBucketFile[]>req.files;
			if (files.length === 0) {
				throw new NotFoundError("No file selected.");
			}
			const post_images = files.map((file) => {
				const imagePath: string = file.location;
				return {
					file_path: imagePath.indexOf('https://') == -1 ? `https://${imagePath}` : imagePath,
					file_type: file.mimetype.split('/')[0]
				};
			});
			res.json({
				message: "Files uploaded successfully",
				data: post_images
			});
		} catch (error) {
			next(error);
		}
	}

	async getPostsByChannel(req: IRequest<any, IGetPostByChannel, IGetPostByChannelFilter>, res: IResponse<any>, next: NextFunction) {
		try {
			const posts: any = await postService.getPostsByChannel(req);
			res.json({
				message: "Posts",
				data: {
					posts: posts.data.map((post: any) => {
						return {
							id: post.id,
							post_date: moment(post.post_date).tz(post.timezone).format("YYYY-MM-DD HH:mm"),
							post_description: post.post_description,							
							hashtag: post.hashtag,
							is_active: post.is_active,
							is_draft: post.is_draft,
							is_approved: post.is_approved,
							campaign_id: post.campaign_id,
							channels: [
								{
									id: post.channel_id,
									channel: post.channel_type,
									image: `${process.env.IMAGE_URL}icons/${post.image}`,
									timezone: post.timezone,
								}
							]
						};
					}),
					paginate: posts.pagination
				}
			});
		} catch (error) {
			next(error);
		}
	}

	async getPostByCampaign(req: IRequest<any>, res: IResponse<any>, next: NextFunction) {
		try {
			const campaignPosts = await postService.getPostByCampaign(req);
			res.json({
				message:"Posts",
				data: campaignPosts
			});
		} catch (error) {
			next(error);
		}
	}

	async deleteCampaignPosts(req: IRequest<any, any, any>, res: IResponse<any>, next: NextFunction) {
		try {
			const postData = req.params as ICampaignPostDeleteBody;
			const deletedPost = await postService.campaignPostDelete(postData);
			res.json({
				message: "Posts Deleted Successfully!",
				data: postData
			})
		} catch (error) {
			next(error);
		}
	}

}

const postsController = new PostsController();

export {
	postsController
};