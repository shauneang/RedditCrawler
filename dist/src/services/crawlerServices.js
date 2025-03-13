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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHourlyTopMemes = exports.saveMemesToFirestore = exports.fetchAndStoreTopMemes = exports.analyseMemes = exports.fetchTopMemes = void 0;
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
const auth_1 = require("../auth");
const database_1 = require("../database");
const memes_1 = require("../utils/memes");
const firebaseServices_1 = require("./firebaseServices");
dotenv_1.default.config();
const REDDIT_MEMES_URL = "https://oauth.reddit.com/r/memes/top.json";
/**
 * Fetch top memes from r/memes over the past 24 hours
 * @param {number} limit - Number of posts to fetch (default: 10)
 * @returns {Promise<any[]>} - List of top Reddit posts
 */
const fetchTopMemes = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (limit = 20) {
    try {
        if (!REDDIT_MEMES_URL) {
            throw new Error("REDDIT_MEMES_URL environment variable missing");
        }
        const token = yield (0, auth_1.getRedditToken)();
        const response = yield axios_1.default.get(REDDIT_MEMES_URL, {
            params: {
                limit,
                t: "day", // Get top posts over the past 24 hours
            },
            headers: {
                "Authorization": `Bearer ${token}`,
                "User-Agent": "RedditScraper/1.0",
            },
        });
        // Extract and return relevant post data
        const memeData = response.data.data.children.map(memes_1.parseMemeData);
        return memeData;
    }
    catch (error) {
        console.error("Error fetching top memes from Reddit:", error);
        throw new Error("Failed to fetch top memes");
    }
});
exports.fetchTopMemes = fetchTopMemes;
/**
 * Analyse non-existing memes in the database
 */
const analyseMemes = (memes) => __awaiter(void 0, void 0, void 0, function* () {
    // Step 1: Create an array to store processed memes
    const analysedMemes = [];
    // Step 2: Loop through each meme
    for (const meme of memes) {
        // Step 3: Check if the meme exists in Firestore
        const exists = yield (0, firebaseServices_1.existsInFirestore)(meme);
        // Step 4: If meme does NOT exist, analyze it; otherwise, keep it unchanged
        if (!exists) {
            console.log(`Analysing: ${meme.title}`);
            const analysedMeme = yield (0, memes_1.analyseMeme)(meme);
            analysedMemes.push(analysedMeme);
        }
        else {
            analysedMemes.push(meme);
        }
    }
    // Step 5: Return the processed memes
    return analysedMemes;
});
exports.analyseMemes = analyseMemes;
/**
 * Fetch top memes from r/memes over the past 24 hours and store in db.
 * Used by cron job
 */
const fetchAndStoreTopMemes = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Fetch top 20 memes from r/memes (past 24 hours)
        const memes = yield (0, exports.fetchTopMemes)(20);
        const analysedMemes = yield (0, exports.analyseMemes)(memes);
        // Store in Firestore (avoid duplicates)
        (0, exports.saveMemesToFirestore)(analysedMemes);
    }
    catch (error) {
        console.error("Error scraping memes:", error);
    }
});
exports.fetchAndStoreTopMemes = fetchAndStoreTopMemes;
/**
 * Save memes to firestore
 */
const saveMemesToFirestore = (memes) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Store in Firestore (avoid duplicates)
        for (const meme of memes) {
            yield (0, firebaseServices_1.savePostToFirestore)(meme);
        }
    }
    catch (error) {
        console.error("Error saving memes:", error);
    }
});
exports.saveMemesToFirestore = saveMemesToFirestore;
/**
 * Get top memes retrieved at a specific hour.
 */
const getHourlyTopMemes = (hour) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const snapshot = yield database_1.db
            .collection("top_memes")
            .where("fetch_timestamp", "==", hour) // Fetch memes retrieved at the given hour
            .orderBy("score", "desc") // Sort by upvote score
            .limit(20)
            .get();
        let memes = snapshot.docs.map((doc) => {
            let data = doc.data();
            return Object.assign(Object.assign({}, data), { fetch_timestamp: data.fetch_timestamp.toDate(), post_timestamp: data.post_timestamp.toDate() });
        });
        return memes;
    }
    catch (error) {
        console.error("❌ Error fetching memes by hour:", error);
        return [];
    }
});
exports.getHourlyTopMemes = getHourlyTopMemes;
