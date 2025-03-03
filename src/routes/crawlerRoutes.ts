import { Router } from "express";
import { fetchTop20Memes, getTop20Memes } from "../controllers/crawlerController";

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

export default router;