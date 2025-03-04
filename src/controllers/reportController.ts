import { Request, Response } from "express";
import { generateReport, getHourlyTopMemes } from "../services/reportServices";
import { MemeDataType } from "../type/redditTypes";
import { getHourlyTimestamp } from "../utils/utils";

/**
 * Generate top meme report.
 */
export const getReport = async (req: Request, res: Response): Promise<void> => {
    try {
        const latestHour = getHourlyTimestamp();
        const memes: MemeDataType[] = await getHourlyTopMemes(latestHour);
        const reportBuffer = await generateReport(memes);

        res.setHeader("Content-Disposition", "attachment; filename=report.pdf");
        res.setHeader("Content-Type", "application/pdf");
        res.send(reportBuffer);
    } catch (error) {
        console.error("❌ Error generating report:", error);
        res.status(500).json({ error: "Failed to generate report" });
    }
};

/**
 * Get top memes for the latest hour from Firestore.
 */
export const getLatestTopMemes = async (req: Request, res: Response) => {
    try {
        const latestHour = getHourlyTimestamp(); // Get the latest hourly timestamp

        const memes = await getHourlyTopMemes(latestHour);

        res.status(200).json({ message: "✅ Latest memes", memes });
    } catch (error) {
        console.error("❌ Error fetching memes:", error);
        res.status(500).json({ error: "Failed to get memes" });
    }
};