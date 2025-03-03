import { Request, Response } from "express";
import { fetchTopMemes } from "../services/crawlerServices";
import { getPostsFromFirestore, savePostToFirestore } from "../services/firebaseServices";
import { MemeDataType } from "../type/redditTypes";

/**
 * @desc Fetch and store top memes from r/memes in Firebase Firestore, then return the top 20 memes
 * @route POST /scrape/memes/fetch
 */
export const fetchTop20Memes = async (req: Request, res: Response): Promise<void> => {
    try {
        // Fetch top 20 memes from r/memes (past 24 hours)
        const memes: MemeDataType[] = await fetchTopMemes(20);

        // Store in Firestore (avoid duplicates)
        for (const meme of memes) {
            await savePostToFirestore(meme);
        }

        // Retrieve the top 20 memes from Firestore (sorted by timestamp)
        const storedMemes = await getPostsFromFirestore(20);

        res.status(200).json({
            message: "Top memes fetched successfully!",
            memes: storedMemes, // Return stored memes
        });
    } catch (error) {
        console.error("Error scraping memes:", error);
        res.status(500).json({ error: "Failed to scrape memes" });
    }
};

/**
 * @desc Fetch memes from Firestore database
 * @route GET /scrape/memes
 */
export const getTop20Memes = async (req: Request, res: Response): Promise<void> => {
    try {
        const memes = await getPostsFromFirestore(20); // Fetch latest 20 memes

        if (memes.length === 0) {
            res.status(404).json({ message: "No memes found in database." });
            return;
        }

        res.status(200).json({
            message: "Memes retrieved successfully!",
            memes,
        });
    } catch (error) {
        console.error("❌ Error fetching memes from Firestore:", error);
        res.status(500).json({ error: "Failed to fetch memes" });
    }
};