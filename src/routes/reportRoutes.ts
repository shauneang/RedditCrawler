import { Router } from "express";
import { getLatestTopMemes, getReport } from "../controllers/reportController";

const router = Router();

// Route to get a report on the top 20 memes in the past 24 hours
router.get("/report", async (req, res) => {
    console.log("📊 Received request: GET /report");
    try {
        await getReport(req, res);
        console.log("✅ Successfully generated meme report.");
    } catch (error) {
        console.error("❌ Error generating meme report:", error);
    }
});

// Route to get the latest top memes data
router.get("/top-memes", async (req, res) => {
    console.log("🔥 Received request: GET /top-memes");
    try {
        await getLatestTopMemes(req, res);
        console.log("✅ Successfully retrieved latest top memes.");
    } catch (error) {
        console.error("❌ Error fetching latest memes:", error);
    }
});

export default router;