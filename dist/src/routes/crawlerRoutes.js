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
const express_1 = require("express");
const crawlerController_1 = require("../controllers/crawlerController");
const router = (0, express_1.Router)();
// Route to trigger fetching for r/memes
router.post("/memes/fetch", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("🕵️‍♂️ Received request: POST /memes/fetch (Triggering Reddit fetch)");
    try {
        yield (0, crawlerController_1.fetchTop20Memes)(req, res);
        console.log("✅ Successfully fetched and stored top 20 memes.");
    }
    catch (error) {
        console.error("❌ Error fetching memes:", error);
    }
}));
// Route to fetch stored memes from Firestore
router.get("/memes", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("📁 Received request: GET /memes (Fetching stored memes from Firestore)");
    try {
        yield (0, crawlerController_1.getTop20Memes)(req, res);
        console.log("✅ Successfully retrieved top 20 memes from Firestore.");
    }
    catch (error) {
        console.error("❌ Error fetching stored memes:", error);
    }
}));
// ✅ Fix: Ensure `async` function is correctly passed
router.get("/memes/:hour", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const requestTime = new Date().toISOString();
    const hourParam = req.params.hour;
    console.log(`📁 [${requestTime}] Incoming Request: GET /memes/${hourParam}`);
    try {
        const hour = parseInt(hourParam, 10);
        if (isNaN(hour) || hour < 0 || hour > 23) {
            console.warn(`⚠️ [${requestTime}] Invalid hour received: ${hourParam}`);
            res.status(400).json({ error: "❌ Invalid hour. Please provide a number between 0-23." });
        }
        yield (0, crawlerController_1.getTopMemesByHour)(req, res);
        console.log(`✅ [${requestTime}] Successfully retrieved top memes for hour ${hour}.`);
    }
    catch (error) {
        console.error(`❌ Error fetching memes for hour ${req.params.hour}:`, error);
        res.status(500).json({ error: "❌ Internal Server Error: Failed to retrieve memes." });
    }
}));
exports.default = router;
