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
const reportController_1 = require("../controllers/reportController");
const router = (0, express_1.Router)();
// Route to get a report on the top 20 memes in the past 24 hours
router.get("/report", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("📊 Received request: GET /report");
    try {
        yield (0, reportController_1.getReport)(req, res);
        console.log("✅ Successfully generated meme report.");
    }
    catch (error) {
        console.error("❌ Error generating meme report:", error);
    }
}));
// Route to get the latest top memes data
router.get("/top-memes", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("🔥 Received request: GET /top-memes");
    try {
        yield (0, reportController_1.getLatestTopMemes)(req, res);
        console.log("✅ Successfully retrieved latest top memes.");
    }
    catch (error) {
        console.error("❌ Error fetching latest memes:", error);
    }
}));
exports.default = router;
