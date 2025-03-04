import { MemeDataType, RedditVideoType } from "../type/redditTypes";
import { detectLabels, extractTextGoogle } from "./imgRecog";
import { analyseSentiment, extractKeywords } from "./nlp";

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

    const fetch_timestamp = new Date();
    fetch_timestamp.setMinutes(0, 0, 0); // Use hourly timestamp

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
        fetch_timestamp: fetch_timestamp,
    };
}

export const analyseMeme = async (post: any): Promise<MemeDataType> => {
    var ocrText = ""
    var detectedObjects: string[] = []

    if (post.post_hint == "image" || !post.is_video) {
        // Extract text and objects from image
        ocrText = await extractTextGoogle(post.url);

        detectedObjects = await detectLabels(post.url);
    }

    // Sentiment Analysis (Wholesome vs Dark)
    const sentiment = analyseSentiment(ocrText + post.title).score;

    // Extract Keywords
    const titleKeywords = await extractKeywords(post.title);
    const ocrKeywords = ocrText ? await extractKeywords(ocrText) : [];

    post.meme_analysis = {
        ocr_text: ocrText,
        detected_objects: detectedObjects,
        sentiment: sentiment,
        keywords: titleKeywords.concat(ocrKeywords),
    };
    return post;
}

export const sortByUpvotes = (memes: MemeDataType[], order: string = "asc"): MemeDataType[] => {
    memes.sort((m1, m2) => order == "asc" ? m1.up_votes - m2.up_votes : m2.up_votes - m1.up_votes)
    return memes;
}