import { MemeDataType, RedditVideoType } from "../type/redditTypes";
import { analyseSentiment, extractKeywords } from "./nlp";
import { extractTextFromImage } from "./ocr";

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
    if (post.post_hint != "image" || post.is_video) {
        return post;
    }
    // Step 1: Extract Text (OCR)
    const ocrText = await extractTextFromImage(post.url);

    // // Step 2: Detect Objects (Google Vision)
    // const detectedObjects = await analyzeMemeImage(post.url);

    // Step 3: Sentiment Analysis (Wholesome vs Dark)
    const sentiment = analyseSentiment(ocrText + post.title).score;

    // // Step 4: AI Classification (CLIP)
    // const memeCategory = await classifyWithCLIP(post.url);

    //Step 5: Extract Keywords
    const titleKeywords = await extractKeywords(post.title);
    const ocrKeywords = await extractKeywords(ocrText);

    post.meme_analysis = {
        ocr_text: ocrText,
        // detected_objects: detectedObjects,
        sentiment: sentiment,
        // category: memeCategory,
        keywords: titleKeywords.concat(ocrKeywords),
    };
    return post;
}