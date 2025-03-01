import { Router } from "express";
import { crawlMemesSubreddit } from "../controllers/redditController";

const router = Router();

// Route to trigger scraping for r/memes
router.post("/memes", crawlMemesSubreddit);

export default router;