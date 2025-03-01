import { MemeDataType, RedditVideoType } from "../type/redditTypes";

export const parseMemeData = (post: any): MemeDataType => {
    let parsedMedia: RedditVideoType | null = null; // Ensure proper typing for media

    if (post.data.is_video && post.data.media?.reddit_video) {
        parsedMedia = {
            has_audio: post.data.media.reddit_video.has_audio,
            dash_url: post.data.media.reddit_video.dash_url,
            duration: post.data.media.reddit_video.duration,
            hls_url: post.data.media.reddit_video.hls_url,
            is_gif: post.data.media.reddit_video.is_gif,
        };
    }

    return {
        title: post.data.title,
        subreddit: post.data.subreddit,
        author_id: post.data.author_fullname,
        author: post.data.author,
        post_id: post.data.name,

        url: post.data.url,
        post_hint: post.data.post_hint ?? undefined,
        is_video: post.data.is_video,
        media: parsedMedia,

        up_votes: post.data.ups,
        down_votes: post.data.downs ?? 0,
        upvote_ratio: post.data.upvote_ratio,
        score: post.data.score,
        num_comments: post.data.num_comments,

        post_timestamp: new Date(post.data.created_utc * 1000),
        timestamp: new Date(),
    };
}