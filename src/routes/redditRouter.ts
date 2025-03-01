import { Router } from "express";
import { getMemesFromDatabase, getScrappedMemes, getTop20Memes } from "../controllers/redditController";

const router = Router();

// Route to trigger fetching for r/memes
router.post("/memes/fetch", getTop20Memes);

// Route to trigger scraping for r/memes
router.get("/memes/scrape", getScrappedMemes);

// Route to fetch stored memes from Firestore
router.get("/memes", getMemesFromDatabase);

export default router;