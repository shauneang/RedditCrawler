export type MemeDataType = {
    title: string;
    subreddit: string;
    author_id: string;
    author: string;
    post_id: string;

    url: string;
    post_hint?: string;
    is_video: boolean;
    media?: RedditVideoType | null; // Updated type for media

    meme_analysis?: MemeAnalysis;

    up_votes: number;
    down_votes: number;
    upvote_ratio: number;
    score: number;
    num_comments: number;


    post_timestamp: Date;
    fetch_timestamp: Date;
};

// Define RedditVideoType for video-specific posts
export type RedditVideoType = {
    has_audio: boolean;
    dash_url: string;
    duration: number;
    hls_url: string;
    is_gif: boolean;
};

// Meme text
export type MemeAnalysis = {
    keywords?: Keyword[]
    sentiment?: string
    ocr_text?: string
    detected_objects?: string[]
    category?: string,
}

export type Keyword = {
    score: number,
    word: string
}