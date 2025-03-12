import axios from "axios";
import dotenv from "dotenv";
import { getRedditToken } from "../auth";
import { db } from "../database";
import { MemeDataType } from "../type/redditTypes";
import { analyseMeme, parseMemeData } from "../utils/memes";
import { existsInFirestore, savePostToFirestore } from "./firebaseServices";

dotenv.config();

const REDDIT_MEMES_URL = "https://oauth.reddit.com/r/memes/top.json"

/**
 * Fetch top memes from r/memes over the past 24 hours
 * @param {number} limit - Number of posts to fetch (default: 10)
 * @returns {Promise<any[]>} - List of top Reddit posts
 */
export const fetchTopMemes = async (limit: number = 20): Promise<MemeDataType[]> => {
    try {
        if (!REDDIT_MEMES_URL) {
            throw new Error("REDDIT_MEMES_URL environment variable missing");
        }
        const token = await getRedditToken();
        const response = await axios.get(REDDIT_MEMES_URL, {
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
        const memeData: MemeDataType[] = response.data.data.children.map(parseMemeData);
        return memeData;
    } catch (error) {
        console.error("Error fetching top memes from Reddit:", error);
        throw new Error("Failed to fetch top memes");
    }
};

/**
 * Analyse non-existing memes in the database
 */
export const analyseMemes = async (memes: MemeDataType[]): Promise<MemeDataType[]> => {
    // Step 1: Create an array to store processed memes
    const analysedMemes: MemeDataType[] = [];

    // Step 2: Loop through each meme
    for (const meme of memes) {
        // Step 3: Check if the meme exists in Firestore
        const exists = await existsInFirestore(meme);

        // Step 4: If meme does NOT exist, analyze it; otherwise, keep it unchanged
        if (!exists) {
            console.log(`Analysing: ${meme.title}`)
            const analysedMeme = await analyseMeme(meme);
            analysedMemes.push(analysedMeme);
        } else {
            analysedMemes.push(meme);
        }
    }

    // Step 5: Return the processed memes
    return analysedMemes;
};

/**
 * Fetch top memes from r/memes over the past 24 hours and store in db.
 * Used by cron job
 */
export const fetchAndStoreTopMemes = async (): Promise<void> => {
    try {
        // Fetch top 20 memes from r/memes (past 24 hours)
        const memes: MemeDataType[] = await fetchTopMemes(20);
        const analysedMemes: MemeDataType[] = await analyseMemes(memes);
        // Store in Firestore (avoid duplicates)
        saveMemesToFirestore(analysedMemes)
    } catch (error) {
        console.error("Error scraping memes:", error);
    }
};

/**
 * Save memes to firestore
 */
export const saveMemesToFirestore = async (memes: MemeDataType[]): Promise<void> => {
    try {
        // Store in Firestore (avoid duplicates)
        for (const meme of memes) {
            await savePostToFirestore(meme);
        }
    } catch (error) {
        console.error("Error saving memes:", error);
    }
}

/**
 * Get top memes retrieved at a specific hour.
 */
export const getHourlyTopMemes = async (hour: Date): Promise<MemeDataType[]> => {
    try {
        const snapshot = await db
            .collection("top_memes")
            .where("fetch_timestamp", "==", hour) // Fetch memes retrieved at the given hour
            .orderBy("score", "desc") // Sort by upvote score
            .limit(20)
            .get();

        let memes = snapshot.docs.map((doc) => {
            let data = doc.data();

            return {
                ...data,
                fetch_timestamp: data.fetch_timestamp.toDate(), // Convert Firestore timestamp to Date
                post_timestamp: data.post_timestamp.toDate(),
            } as MemeDataType;
        });

        return memes;
    } catch (error) {
        console.error("❌ Error fetching memes by hour:", error);
        return [];
    }
};