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
exports.getLatestTopMemes = exports.getReport = void 0;
const reportServices_1 = require("../services/reportServices");
const utils_1 = require("../utils/utils");
/**
 * Generate top meme report.
 */
const getReport = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const latestHour = (0, utils_1.getHourlyTimestamp)();
        let memes = yield (0, reportServices_1.getHourlyTopMemes)(latestHour);
        memes = memes.length == 0 ? yield (0, reportServices_1.getCurrentTopMemes)() : memes;
        const reportBuffer = yield (0, reportServices_1.generateReport)(memes);
        res.setHeader("Content-Disposition", "attachment; filename=report.pdf");
        res.setHeader("Content-Type", "application/pdf");
        res.send(reportBuffer);
    }
    catch (error) {
        console.error("❌ Error generating report:", error);
        res.status(500).json({ error: "Failed to generate report" });
    }
});
exports.getReport = getReport;
/**
 * Get top memes for the latest hour from Firestore.
 */
const getLatestTopMemes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const memes = yield (0, reportServices_1.getCurrentTopMemes)();
        res.status(200).json({ message: "✅ Latest memes", memes });
    }
    catch (error) {
        console.error("❌ Error fetching memes:", error);
        res.status(500).json({ error: "Failed to get memes" });
    }
});
exports.getLatestTopMemes = getLatestTopMemes;
