import axios from "axios";
import dotenv from "dotenv";
import { MemeDataType } from "../type/redditTypes";
import { analyseMeme, parseMemeData } from "../utils/memes";
import { savePostToFirestore } from "./firebaseServices";

dotenv.config();

/**
 * Fetch top memes from r/memes over the past 24 hours
 * @param {number} limit - Number of posts to fetch (default: 10)
 * @returns {Promise<any[]>} - List of top Reddit posts
 */
export const fetchTopMemes = async (limit: number = 20): Promise<MemeDataType[]> => {
    try {
        if (!process.env.REDDIT_MEMES_URL) {
            throw new Error("REDDIT_MEMES_URL environment variable missing");
        }

        const response = await axios.get("https://www.reddit.com/r/memes/top.json", {
            params: {
                limit,
                t: "day", // Get top posts over the past 24 hours
            },
            headers: {
                "User-Agent": "RedditScraper/1.0",
            },
        });

        // Extract and return relevant post data
        const memeData: MemeDataType[] = response.data.data.children.map(parseMemeData);
        const ocrMemeData: MemeDataType[] = await Promise.all(memeData.map(analyseMeme));
        return ocrMemeData;
    } catch (error) {
        console.error("Error fetching top memes from Reddit:", error);
        throw new Error("Failed to fetch top memes");
    }
};


/**
 * Fetch top memes from r/memes over the past 24 hours and store in db.
 * Used by cron job
 */
export const fetchAndStoreTopMemes = async (): Promise<void> => {
    try {
        // Fetch top 20 memes from r/memes (past 24 hours)
        const memes: MemeDataType[] = await fetchTopMemes(20);

        // Store in Firestore (avoid duplicates)
        for (const meme of memes) {
            await savePostToFirestore(meme);
        }
    } catch (error) {
        console.error("Error scraping memes:", error);
    }
};