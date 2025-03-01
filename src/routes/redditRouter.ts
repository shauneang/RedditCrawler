import { Router } from "express";
import { crawlMemesSubreddit, getMemesFromDatabase } from "../controllers/redditController";

const router = Router();

// Route to trigger scraping for r/memes
router.post("/memes", crawlMemesSubreddit);

// Route to fetch stored memes from Firestore
router.get("/memes", getMemesFromDatabase);

export default router;