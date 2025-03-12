"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateTopKeywords = exports.sortByUpvotes = exports.analyseMeme = exports.parseMemeData = void 0;
const imgRecog_1 = require("./imgRecog");
const nlp_1 = require("./nlp");
const parseMemeData = (post) => {
    var _a, _b, _c;
    let parsedMedia = null; // Ensure proper typing for media
    if (post.data.is_video && ((_a = post.data.media) === null || _a === void 0 ? void 0 : _a.reddit_video)) {
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
        post_hint: (_b = post.data.post_hint) !== null && _b !== void 0 ? _b : undefined,
        is_video: post.data.is_video,
        media: parsedMedia,
        up_votes: post.data.ups,
        down_votes: (_c = post.data.downs) !== null && _c !== void 0 ? _c : 0,
        upvote_ratio: post.data.upvote_ratio,
        score: post.data.score,
        num_comments: post.data.num_comments,
        post_timestamp: new Date(post.data.created_utc * 1000),
        fetch_timestamp: fetch_timestamp,
    };
};
exports.parseMemeData = parseMemeData;
const analyseMeme = (post) => __awaiter(void 0, void 0, void 0, function* () {
    var ocrText = "";
    var detectedObjects = [];
    if (post.post_hint == "image" || !post.is_video) {
        // Extract text and objects from image
        ocrText = yield (0, imgRecog_1.extractTextGoogle)(post.url);
        detectedObjects = yield (0, imgRecog_1.detectLabels)(post.url);
    }
    // Sentiment Analysis (Wholesome vs Dark)
    const sentiment = (0, nlp_1.analyseSentiment)(ocrText + post.title).score;
    // Extract Keywords
    const titleKeywords = yield (0, nlp_1.extractKeywords)(post.title);
    const ocrKeywords = ocrText ? yield (0, nlp_1.extractKeywords)(ocrText) : [];
    post.meme_analysis = {
        ocr_text: ocrText,
        detected_objects: detectedObjects,
        sentiment: sentiment,
        keywords: titleKeywords.concat(ocrKeywords),
    };
    return post;
});
exports.analyseMeme = analyseMeme;
const sortByUpvotes = (memes, order = "asc") => {
    memes.sort((m1, m2) => order == "asc" ? m1.up_votes - m2.up_votes : m2.up_votes - m1.up_votes);
    return memes;
};
exports.sortByUpvotes = sortByUpvotes;
/**
 * Generates a top keyword aggregation list with counts.
 */
const generateTopKeywords = (memes, minCount = 3, maxKeywords = 10) => {
    const keywordCounts = {};
    // ✅ Extract and count keywords
    memes.forEach(meme => {
        var _a;
        const keywords = ((_a = meme.meme_analysis) === null || _a === void 0 ? void 0 : _a.detected_objects) || [];
        keywords.forEach((word) => {
            keywordCounts[word] = (keywordCounts[word] || 0) + 1;
        });
    });
    // ✅ Filter words that appear at least `minCount` times
    const filteredKeywords = Object.entries(keywordCounts)
        .filter(([_, count]) => count >= minCount)
        .map(([word, count]) => ({ word, count }));
    // ✅ Sort by count in descending order and limit to `maxKeywords`
    return filteredKeywords.sort((a, b) => b.count - a.count).slice(0, maxKeywords);
};
exports.generateTopKeywords = generateTopKeywords;
