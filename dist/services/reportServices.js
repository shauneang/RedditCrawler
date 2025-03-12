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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrentTopMemes = exports.getHourlyTopMemes = exports.generateReport = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const pdfmake_1 = __importDefault(require("pdfmake"));
const database_1 = require("../database");
const pdfHelper_1 = require("../utils/pdfHelper");
const pdfTemplates_1 = require("../utils/pdfTemplates");
var fonts = {
    Courier: {
        normal: 'Courier',
        bold: 'Courier-Bold',
        italics: 'Courier-Oblique',
        bolditalics: 'Courier-BoldOblique'
    },
    Helvetica: {
        normal: 'Helvetica',
        bold: 'Helvetica-Bold',
        italics: 'Helvetica-Oblique',
        bolditalics: 'Helvetica-BoldOblique'
    },
    Times: {
        normal: 'Times-Roman',
        bold: 'Times-Bold',
        italics: 'Times-Italic',
        bolditalics: 'Times-BoldItalic'
    },
    Symbol: {
        normal: 'Symbol'
    },
    ZapfDingbats: {
        normal: 'ZapfDingbats'
    }
};
const printer = new pdfmake_1.default(fonts);
/**
 * Generate a valid PDF report and return its file path.
 */
const generateReport = (memes) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const today = new Date();
            const formattedDate = new Intl.DateTimeFormat('en-GB', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            }).format(today).split("/").join("-");
            const filePath = path_1.default.join(__dirname, `../../top_memes_report_${formattedDate}.pdf`);
            const memesTable = (0, pdfHelper_1.generateTopMemesTable)(memes);
            const rankedCreatorsTable = (0, pdfHelper_1.generateRankedCreatorsTable)(memes);
            const keywordsTable = (0, pdfHelper_1.generateKeywordTable)(memes);
            // const timestampGraph = await generateTimestampGraph(memes);
            const timestampGraph = yield (0, pdfHelper_1.generateAggregatedTimestampGraph)();
            const commentsVsUpvotesGraph = yield (0, pdfHelper_1.generateUpvotesVsCommentsGraph)(memes);
            const votesVsUpvoteRatioGraph = yield (0, pdfHelper_1.generateVotesVsUpvoteRatioGraph)(memes);
            const postFormatDistributionGraph = yield (0, pdfHelper_1.generatePostFormatDistributionGraph)(memes);
            const sentimentGraph = yield (0, pdfHelper_1.generateSentimentGraph)(memes);
            // Document Definition for pdfmake
            const docDefinition = (0, pdfTemplates_1.generateMemeReportTemplate)(memesTable, rankedCreatorsTable, keywordsTable, timestampGraph, commentsVsUpvotesGraph, votesVsUpvoteRatioGraph, postFormatDistributionGraph, sentimentGraph);
            // Generate PDF
            const pdfDoc = printer.createPdfKitDocument(docDefinition);
            const writeStream = fs_1.default.createWriteStream(filePath);
            pdfDoc.pipe(writeStream);
            pdfDoc.end();
            writeStream.on("finish", () => resolve(filePath));
            writeStream.on("error", (err) => reject(err));
        }
        catch (error) {
            reject(error);
        }
    }));
});
exports.generateReport = generateReport;
/**
 * Get top memes for the by hour from Firestore.
 */
const getHourlyTopMemes = (hour) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const snapshot = yield database_1.db
            .collection("top_memes")
            .where("fetch_timestamp", "==", hour)
            .orderBy("score", "desc") // Sort by score (best memes first)
            .limit(20)
            .get();
        let memes = snapshot.docs.map((doc) => {
            let data = doc.data();
            return Object.assign(Object.assign({}, data), { fetch_timestamp: data.fetch_timestamp.toDate(), post_timestamp: data.post_timestamp.toDate() });
        });
        return memes;
    }
    catch (error) {
        console.error("❌ Error fetching memes:", error);
        return [];
    }
});
exports.getHourlyTopMemes = getHourlyTopMemes;
/**
 * Fetch the latest top memes.
 */
const getCurrentTopMemes = () => __awaiter(void 0, void 0, void 0, function* () {
    // If no memes are found for the requested hour, get the latest available memes
    const snapshot = yield database_1.db
        .collection("top_memes")
        .orderBy("fetch_timestamp", "desc") // Get the latest timestamped memes
        .orderBy("score", "desc") // Sort by score within the latest timestamp
        .limit(20)
        .get();
    let memes = snapshot.docs.map((doc) => {
        let data = doc.data();
        return Object.assign(Object.assign({}, data), { fetch_timestamp: data.fetch_timestamp.toDate(), post_timestamp: data.post_timestamp.toDate() });
    });
    return memes;
});
exports.getCurrentTopMemes = getCurrentTopMemes;
