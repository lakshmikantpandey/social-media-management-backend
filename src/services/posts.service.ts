import moment from 'moment';
import { ConflictError, NoContentError, NotFoundError } from '../errors';
import { IRequest } from '../interfaces';
import { ICreatePost, IEditPost, IGetPostByChannel, IGetPostByChannelFilter, IPost, ISearchPosts } from '../interfaces/posts.interface';
import { UserChannel } from '../models';
import { Post, PostCampaign, PostChannelMap, PostFile } from '../models/post.model';
import postCampaignService from './post-campaign.service';

class PostService {
	async createPost(body: ICreatePost) {
		try {
			const campaignId = body.campaign_id;
			const selectedChannels = body.channel_id;
			const post_date = body.post_date;
			delete body.campaign_id;
			delete body.channel_id;
			delete body.post_date;
			// create post			
			const post: any = await Post.transaction(async trx => {
				const postCreated = await Post.query(trx).insert(body);
				// campaign creation
				if (campaignId !== undefined) {
					await postCreated
						.$relatedQuery('campaign', trx)
						.insert({
							campaign_id: campaignId
						});
				}
				const channelsDetails = await UserChannel
					.query()
					.select(...["id", "timezone"])
					.where("id", "in", selectedChannels || []).castTo<{ id: string, timezone: string }[]>();

				const postChannelMap = channelsDetails.map((channel) => {
					return {
						channel_id: channel.id,
						timezone: channel.timezone,
						post_date: moment(post_date).tz(channel.timezone).utc()
					}
				});
				// save post channel map table
				await postCreated.$relatedQuery('channel_map', trx).insert(postChannelMap);
				return postCreated;
			});
			return post;
		} catch (error: any) {
			throw new Error(error);
		}
	}

	async editPost(body: IEditPost) {
		try {
			const campaignId = body.campaign_id;
			const selectedChannels = body.channel_id;
			delete body.campaign_id;
			delete body.channel_id;

			// get post detail
			const post = await Post.query().findById(body.post_id);
			// update post
			await Post.query().patch({
				post_description: body.post_description,
				// post_date: body.post_date,
				hashtag: JSON.stringify(body.hashtag),
				is_draft: body.is_draft
			}).findById(body.post_id);
			// delete files
			await post?.$relatedQuery("files").delete();
			await post?.$relatedQuery("campaign").delete();
			await post?.$relatedQuery("channel_map").delete();

			// update values
			const channelsDetails = await UserChannel
				.query()
				.select(...["id", "timezone"])
				.where("id", "in", selectedChannels || []).castTo<{ id: string, timezone: string }[]>();
			const postChannelMap = channelsDetails.map((channel) => {
				return {
					channel_id: channel.id,
					timezone: channel.timezone
				};
			});
			await post?.$relatedQuery('channel_map').insert(postChannelMap);
			// campaign creation
			if (campaignId !== undefined) {
				await post?.$relatedQuery('campaign')
					.insert({
						campaign_id: campaignId
					});
			}
			return [];
		} catch (error: any) {
			throw new Error(error);
		}
	}

	// DONE: get search posts
	async getAllPosts(req: IRequest<any, any, ISearchPosts>) {
		const search = req.query;
		const postKnex = PostChannelMap.knex();
		return await postKnex.table('post_channels_map as pcm')
			.columns(["pcm.post_id as id", "pcm.post_date", "pcm.channel_id", "pcm.timezone", "p.user_id", "p.post_description", "p.hashtag"])
			.innerJoin(
				"posts as p",
				"pcm.post_id",
				"=",
				"p.id"
			).where("p.user_id", req.user?.id)
			.andWhere("p.deleted_at", null)
			.andWhere("p.is_draft", false)
			.andWhere("p.publish_at", null)
			.andWhereBetween("pcm.post_date", [search.start, search.end]);
	}

	// delete posts
	async deletePost(post_id: string) {
		const post = await Post.query().findById(post_id).castTo<IPost>();
		if (!post) {
			throw new NotFoundError("Invalid post");
		}
		// check if already deleted
		if (post.deleted_at != null) {
			throw new NoContentError("Post already deleted");
		}
		// delete post
		await Post.query().patch({
			deleted_at: moment().utc()
		}).where("id", post_id);
	}

	async getPostsByChannel(req: IRequest<any, IGetPostByChannel, IGetPostByChannelFilter>) {
		const postKnex = PostChannelMap.knex();
		const query = req.query;
		
		let posts = postKnex.table('post_channels_map as pcm')
			.columns(["pcm.post_id as id", "pcm.post_date", "pcm.channel_id", "pcm.timezone", "p.user_id", "p.post_description", "p.hashtag"])
			.innerJoin(
				"posts as p",
				"pcm.post_id",
				"=",
				"p.id"
			).where("p.user_id", req.user?.id)
			.andWhere("pcm.channel_id", req.params.channel_id)
			.andWhere("p.deleted_at", null)
			.andWhere("p.is_draft", query.is_draft == "true");

		if(query.published == "true") {
			posts = posts.whereNotNull("p.publish_at");
		} else {
			posts = posts.where("p.publish_at", null);
		}
		return await posts.paginate({
			currentPage: query.page || 0,
			perPage: 10
		});
	}
}

const postService = new PostService()

export {
	postService
};