import moment from 'moment';
import { raw, ref } from "objection";
import { ConflictError, NoContentError, NotFoundError } from '../errors';
import { IRequest } from '../interfaces';
import { ICreatePost, IEditPost, IGetPostByChannel, IGetPostByChannelFilter, IPost, ISearchPosts } from '../interfaces/posts.interface';
import { UserChannel, Campaign } from '../models';
import { Post, PostCampaign, PostCampaignMap, PostChannelMap, PostFile } from '../models/post.model';
import postCampaignService from './post-campaign.service';
import userChannelService from "./user-channel.service";
import { ICampaignPostDeleteBody } from '../interfaces/campaign.interface';

class PostService {

	async getPostById(req: any) {
		const user_id = req.user?.id
		const post: any = await Post.query().select(['id', 'user_id', 'post_description', 'post_files', 'hashtag', 'is_draft']).findById(req.params.id).where('user_id', user_id).first();
		const campaigns = await PostCampaignMap.query().select(['campaign_id']).where('post_id', post.id);
		const postChannels = await PostChannelMap.query().select(['post_id', 'channel_id', "post_date", "timezone"]).where('post_id', post.id);
		// const channels = await userChannelService.getConnectedChannel(req.user.id, ['id', 'channel_type']);
		return {
			...post, campaign: campaigns.map((campaign: any) => {
				return campaign.campaign_id;
			}), postChannels
		};
	}

	async createPost(body: ICreatePost) {
		try {
			const campaignId = body.campaign_id;
			const selectedChannels = body.channel_id;
			const post_date = body.post_date;
			delete body.campaign_id;
			delete body.channel_id;
			delete body.post_date;
			delete body.is_scheduled;
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
				is_draft: body.is_draft,
				post_files: JSON.stringify(body.post_files)
			}).findById(body.post_id);
			// delete files
			// await post?.$relatedQuery("files").delete();
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
					timezone: channel.timezone,
					post_date: moment(body.post_date).tz(channel.timezone).utc()
				};
			});
			await post?.$relatedQuery('channel_map').insert(postChannelMap);
			// campaign creation
			if (campaignId !== undefined || campaignId !== "") {
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
			.andWhere("pcm.post_date", ">", "now()")
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
			throw new NotFoundError("Post not found");
		}
		// delete post
		const posts = await Post.query().patch({
			deleted_at: moment().utc(),
			is_approved: false,
			is_active: false
		}).where("id", post_id);
		// delete post from campaign
		await PostCampaignMap.query().patch({
			deleted_at: moment().utc()
		}).where({
			post_id: post_id,
		});
		// delete from post channel table
		await PostChannelMap.query().patch({
			deleted_at: moment().utc()
		}).where({
			post_id: post_id,
		});
		return posts;
	}

	async getPostsByChannel(req: IRequest<any, IGetPostByChannel, IGetPostByChannelFilter>) {
		const postKnex = PostChannelMap.knex();
		const query = req.query;
		let posts = postKnex.table('post_channels_map as pcm')
			.columns([
				"pcm.post_id as id",
				"pcm.post_date",
				"pcm.channel_id",
				"pcm.timezone",
				"p.user_id",
				"p.post_description",
				"p.hashtag",
				"p.is_draft",
				"p.is_active",
				"p.is_approved",
				"uc.channel_type",
				"ch.image",
				"pc.campaign_id"
			])
			.innerJoin("posts as p", "pcm.post_id", "=", "p.id")
			.innerJoin("user_channels as uc", "pcm.channel_id", "=", "uc.id")
			.innerJoin("channels as ch", "uc.channel_type", "=", "ch.slug")
			.leftJoin("posts_campaigns as pc", "pcm.post_id", "=", "pc.post_id")
			.where("p.user_id", req.user?.id)
			.andWhere("pcm.channel_id", req.params.channel_id)
			.andWhere("p.deleted_at", null)
			.andWhere("p.is_draft", query.is_draft == "true")
			.andWhere("pc.campaign_id", null)
			.andWhere("pcm.post_date", ">", "now()")
			.orderBy("pcm.post_date", "asc");

		if (query.published == "true") {
			posts = posts.whereNotNull("p.publish_at");
		} else {
			posts = posts.where("p.publish_at", null);
		}
		posts = posts.orderBy("pcm.post_date", "asc");
		return await posts.paginate({
			currentPage: query.page || 0,
			perPage: 10
		});
	}

	async getPostByCampaign(req: IRequest<any>) {
		const campaignId = req.params.campaign_id;
		const query: any = req.query;
		const filterPosts: any = {};
		const limit = 10;
		const offset: number = query.page == undefined ? 0 : (query.page - 1) * limit;

		let campaignPosts = await Post
			.query()
			.alias('p')
			.select(['p.id', "p.post_description", "p.is_draft", "p.is_approved", "pcm.channel_id", "uc.channel_type", "uc.timezone", "ch.image", "p.hashtag", "pcm.post_date"])
			.innerJoin("post_channels_map as pcm", "pcm.post_id", "p.id")
			.innerJoin("user_channels as uc", "uc.id", "pcm.channel_id")
			.innerJoin("channels as ch", "ch.slug", "uc.channel_type")
			.where("p.user_id", req.user?.id??0)
			.whereIn("p.id", PostCampaign.query().select('post_id').where('campaign_id', campaignId))
			.andWhere("p.deleted_at", null)
			.andWhere("p.is_draft", query.is_draft == "true" ? true : false)
			.andWhere("p.is_approved", query.is_approved == "true" ? true : false)
			.andWhere("pcm.post_date", ">", "now()")
			.orderBy("pcm.post_date", "ASC")
			.offset(offset)
			.limit(limit);

		// filter posts
		campaignPosts.forEach((post: any) => {
			if (!filterPosts.hasOwnProperty(post.id)) {
				post.channel_id = [{ channel: post.channel_type, image: `${process.env.IMAGE_URL}icons/${post.image}`, id: post.channel_id, timezone: post.timezone }];
				filterPosts[post.id] = post;
			} else {
				filterPosts[post.id].channel_id.push({ channel: post.channel_type, image: `${process.env.IMAGE_URL}icons/${post.image}`, id: post.channel_id, timezone: post.timezone });
			}
		});
		const posts = Object.values(filterPosts).map((post: any) => {
			return { id: post.id, post_description: post.post_description, channels: post.channel_id, is_draft: post.is_draft, is_approved: post.is_approved, hashtag: post.hashtag, post_date: post.post_date };
		});
		return posts;
	}

	async sharePost(body: ICreatePost) {
		console.log("Share Post: ", body);
		const userChannelKnex = UserChannel.knex();
		const channels = await userChannelKnex.raw("SELECT id, channel_type, user_auth FROM user_channels where id in (?)", [...body.channel_id as any]);
		console.log(channels.rows);
	}

	async campaignPostDelete(body: ICampaignPostDeleteBody) {
		console.log("Post Body: ", body);
		
	}

}

const postService = new PostService();

export {
	postService
};