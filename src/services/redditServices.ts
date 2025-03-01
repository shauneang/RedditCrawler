import axios from "axios";
import dotenv from "dotenv";
import { MemeDataType } from "../type/redditTypes";
import { parseMemeData } from "../utils/memes";

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
        return response.data.data.children.map(parseMemeData);
    } catch (error) {
        console.error("Error fetching top memes from Reddit:", error);
        throw new Error("Failed to fetch top memes");
    }
};