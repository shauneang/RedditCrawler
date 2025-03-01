import { Request, Response } from "express";
import { getPostsFromFirestore, savePostToFirestore } from "../services/firebaseServices";
import { fetchTopMemes, scrapeRedditMemes } from "../services/redditServices";
import { MemeDataType } from "../type/redditTypes";

/**
 * @desc Fetch and store top memes from r/memes in Firebase Firestore, then return the top 20 memes
 * @route POST /scrape/memes/fetch
 */
export const getTop20Memes = async (req: Request, res: Response): Promise<void> => {
    try {
        // Fetch top 20 memes from r/memes (past 24 hours)
        const memes: MemeDataType[] = await fetchTopMemes(20);

        // Store in Firestore (avoid duplicates)
        for (const meme of memes) {
            console.log(meme.title);
            await savePostToFirestore(meme);
        }

        // Retrieve the top 20 memes from Firestore (sorted by timestamp)
        const storedMemes = await getPostsFromFirestore(20);

        res.status(200).json({
            message: "Top memes scraped successfully!",
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
export const getMemesFromDatabase = async (req: Request, res: Response): Promise<void> => {
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

/**
 * @desc Fetch memes from web scraping
 * @route GET /scrape/memes/scrape
 */
export const getScrappedMemes = async (req: Request, res: Response): Promise<void> => {
    try {
        const memes = await scrapeRedditMemes();

        if (memes.length === 0) {
            res.status(404).json({ message: "No memes found from scraping." });
            return;
        }

        res.status(200).json({
            message: "Memes scraped successfully!",
            memes,
        });
    } catch (error) {
        console.error("❌ Error scraping memes:", error);
        res.status(500).json({ error: "Failed to scrape memes" });
    }
};