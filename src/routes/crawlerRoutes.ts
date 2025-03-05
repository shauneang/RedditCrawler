import { Router } from "express";
import { fetchTop20Memes, getTop20Memes, getTopMemesByHour } from "../controllers/crawlerController";

const router = Router();

// Route to trigger fetching for r/memes
router.post("/memes/fetch", async (req, res) => {
    console.log("🕵️‍♂️ Received request: POST /memes/fetch (Triggering Reddit fetch)");
    try {
        await fetchTop20Memes(req, res);
        console.log("✅ Successfully fetched and stored top 20 memes.");
    } catch (error) {
        console.error("❌ Error fetching memes:", error);
    }
});

// Route to fetch stored memes from Firestore
router.get("/memes", async (req, res) => {
    console.log("📁 Received request: GET /memes (Fetching stored memes from Firestore)");
    try {
        await getTop20Memes(req, res);
        console.log("✅ Successfully retrieved top 20 memes from Firestore.");
    } catch (error) {
        console.error("❌ Error fetching stored memes:", error);
    }
});

// ✅ Fix: Ensure `async` function is correctly passed
router.get("/memes/:hour", async (req, res) => {
    const requestTime = new Date().toISOString();
    const hourParam = req.params.hour;
    console.log(`📁 [${requestTime}] Incoming Request: GET /memes/${hourParam}`);
    try {
        const hour = parseInt(hourParam, 10);
        if (isNaN(hour) || hour < 0 || hour > 23) {
            console.warn(`⚠️ [${requestTime}] Invalid hour received: ${hourParam}`);
            res.status(400).json({ error: "❌ Invalid hour. Please provide a number between 0-23." });
        }
        await getTopMemesByHour(req, res);
        console.log(`✅ [${requestTime}] Successfully retrieved top memes for hour ${hour}.`);

    } catch (error) {
        console.error(`❌ Error fetching memes for hour ${req.params.hour}:`, error);
        res.status(500).json({ error: "❌ Internal Server Error: Failed to retrieve memes." });
    }
});

export default router;