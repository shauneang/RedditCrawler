"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTopMemesByHour = exports.getTop20Memes = exports.fetchTop20Memes = void 0;
const crawlerServices_1 = require("../services/crawlerServices");
const firebaseServices_1 = require("../services/firebaseServices");
const reportServices_1 = require("../services/reportServices");
/**
 * @desc Fetch and store top memes from r/memes in Firebase Firestore, then return the top 20 memes
 * @route POST /scrape/memes/fetch
 */
const fetchTop20Memes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Fetch top 20 memes from r/memes (past 24 hours)
        const memes = yield (0, crawlerServices_1.fetchTopMemes)(20);
        const analysedMemes = yield (0, crawlerServices_1.analyseMemes)(memes);
        (0, crawlerServices_1.saveMemesToFirestore)(analysedMemes);
        res.status(200).json({
            message: "Top memes fetched successfully!",
            memes: analysedMemes, // Return stored memes
        });
    }
    catch (error) {
        console.error("Error scraping memes:", error);
        res.status(500).json({ error: "Failed to scrape memes" });
    }
});
exports.fetchTop20Memes = fetchTop20Memes;
/**
 * @desc Fetch memes from Firestore database
 * @route GET /scrape/memes
 */
const getTop20Memes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const memes = yield (0, firebaseServices_1.getPostsFromFirestore)(20); // Fetch latest 20 memes
        if (memes.length === 0) {
            res.status(404).json({ message: "No memes found in database." });
            return;
        }
        res.status(200).json({
            message: "Memes retrieved successfully!",
            memes,
        });
    }
    catch (error) {
        console.error("❌ Error fetching memes from Firestore:", error);
        res.status(500).json({ error: "Failed to fetch memes" });
    }
});
exports.getTop20Memes = getTop20Memes;
/**
 * Controller to get top memes retrieved at a specific hour.
 */
const getTopMemesByHour = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const memes = yield (0, reportServices_1.getHourlyTopMemes)(targetHour);
        // Return response
        if (memes.length === 0) {
            return res.status(404).json({ error: `❌ No memes found for hour ${hour}.` });
        }
        res.json({ hour, top_memes: memes });
    }
    catch (error) {
        console.error("❌ Error fetching memes by hour:", error);
        res.status(500).json({ error: "❌ Server error while fetching memes." });
    }
});
exports.getTopMemesByHour = getTopMemesByHour;
