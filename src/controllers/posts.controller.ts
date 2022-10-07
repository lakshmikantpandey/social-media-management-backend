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

export const uploadImage = uploadImages.array('upload_files', 5);

class PostsController extends Controller {

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
			const post = await postService.createPost(body);
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
			const postId = req.params.post_id;
			// check if post available
			await postService.deletePost(postId);
			res.json({
				message: "Post deleted successfully!"
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
				return {
					file_path: file.location,
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
							timezone: post.timezone,
							post_description: post.post_description,
							channel_id: post.channel_id
						};
					}),
					paginate: posts.pagination
				}
			});
		} catch (error) {
			next(error);
		}
	}

}

const postsController = new PostsController();

export {
	postsController
};