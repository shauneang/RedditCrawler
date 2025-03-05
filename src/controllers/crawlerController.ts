import { Request, Response } from "express";
import { analyseMemes, fetchTopMemes, saveMemesToFirestore } from "../services/crawlerServices";
import { getPostsFromFirestore } from "../services/firebaseServices";
import { getHourlyTopMemes } from "../services/reportServices";
import { MemeDataType } from "../type/redditTypes";

/**
 * @desc Fetch and store top memes from r/memes in Firebase Firestore, then return the top 20 memes
 * @route POST /scrape/memes/fetch
 */
export const fetchTop20Memes = async (req: Request, res: Response): Promise<void> => {
    try {
        // Fetch top 20 memes from r/memes (past 24 hours)
        const memes: MemeDataType[] = await fetchTopMemes(20);
        const analysedMemes: MemeDataType[] = await analyseMemes(memes);
        saveMemesToFirestore(analysedMemes)

        res.status(200).json({
            message: "Top memes fetched successfully!",
            memes: analysedMemes, // Return stored memes
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


/**
 * Controller to get top memes retrieved at a specific hour.
 */
export const getTopMemesByHour = async (req: Request, res: Response) => {
    try {
        // Parse the hour from the request
        const hour = parseInt(req.params.hour, 10);

        // Validate the hour range (0-23)
        if (isNaN(hour) || hour < 0 || hour > 23) {
            return res.status(400).json({ error: "❌ Invalid hour. Please provide a number between 0-23." });
        }

        // Get the latest top memes retrieved at that hour
        const targetHour = new Date();
        targetHour.setHours(hour, 0, 0, 0);

        const memes = await getHourlyTopMemes(targetHour);

        // Return response
        if (memes.length === 0) {
            return res.status(404).json({ error: `❌ No memes found for hour ${hour}.` });
        }

        res.json({ hour, top_memes: memes });
    } catch (error) {
        console.error("❌ Error fetching memes by hour:", error);
        res.status(500).json({ error: "❌ Server error while fetching memes." });
    }
};
