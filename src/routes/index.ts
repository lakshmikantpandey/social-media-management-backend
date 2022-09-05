import channelRoute from "./channels.router";
import usersRouter from "./users.router";
import socialRouter from "./social.router";
import campaignRouter from "./campaign.router";
import teamsRouter from "./teams.router";
import userChannelRouter from "./user-channel.router";
import postRouter from "./posts.router";

export default [
    usersRouter,
    channelRoute,
    socialRouter,
    campaignRouter,
    teamsRouter,
    userChannelRouter,
    postRouter
];