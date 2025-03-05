import fs from "fs";
import path from "path";
import PdfPrinter from "pdfmake";
import { TDocumentDefinitions } from "pdfmake/interfaces";
import { db } from "../database";
import { MemeDataType } from "../type/redditTypes";
import { generateAggregatedTimestampGraph, generateKeywordTable, generatePostFormatDistributionGraph, generateRankedCreatorsTable, generateSentimentGraph, generateTopMemesTable, generateUpvotesVsCommentsGraph, generateVotesVsUpvoteRatioGraph } from "../utils/pdfHelper";
import { generateMemeReportTemplate } from "../utils/pdfTemplates";

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

const printer = new PdfPrinter(fonts);

/**
 * Generate a valid PDF report and return its file path.
 */
export const generateReport = async (memes: any[]): Promise<string> => {
    return new Promise(async (resolve, reject) => {
        try {
            const today = new Date();

            const formattedDate = new Intl.DateTimeFormat('en-GB', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            }).format(today).split("/").join("-");

            const filePath = path.join(__dirname, `../../top_memes_report_${formattedDate}.pdf`);
            const memesTable = generateTopMemesTable(memes)
            const rankedCreatorsTable = generateRankedCreatorsTable(memes);
            const keywordsTable = generateKeywordTable(memes);
            // const timestampGraph = await generateTimestampGraph(memes);
            const timestampGraph = await generateAggregatedTimestampGraph();
            const commentsVsUpvotesGraph = await generateUpvotesVsCommentsGraph(memes);
            const votesVsUpvoteRatioGraph = await generateVotesVsUpvoteRatioGraph(memes);
            const postFormatDistributionGraph = await generatePostFormatDistributionGraph(memes);
            const sentimentGraph = await generateSentimentGraph(memes);

            // Document Definition for pdfmake
            const docDefinition: TDocumentDefinitions = generateMemeReportTemplate(memesTable, rankedCreatorsTable, keywordsTable, timestampGraph, commentsVsUpvotesGraph, votesVsUpvoteRatioGraph, postFormatDistributionGraph, sentimentGraph)

            // Generate PDF
            const pdfDoc = printer.createPdfKitDocument(docDefinition);
            const writeStream = fs.createWriteStream(filePath);

            pdfDoc.pipe(writeStream);
            pdfDoc.end();

            writeStream.on("finish", () => resolve(filePath));
            writeStream.on("error", (err) => reject(err));
        } catch (error) {
            reject(error);
        }
    });
};

/**
 * Get top memes for the by hour from Firestore.
 */
export const getHourlyTopMemes = async (hour: Date): Promise<MemeDataType[]> => {
    try {
        const snapshot = await db
            .collection("top_memes")
            .where("fetch_timestamp", "==", hour)
            .orderBy("score", "desc") // Sort by score (best memes first)
            .limit(20)
            .get();

        let memes = snapshot.docs.map((doc) => {
            let data = doc.data();

            return {
                ...data,
                fetch_timestamp: data.fetch_timestamp.toDate(), // ✅ Convert to JavaScript Date
                post_timestamp: data.post_timestamp.toDate(),   // ✅ Convert to JavaScript Date
            } as MemeDataType;
        }); return memes;
    } catch (error) {
        console.error("❌ Error fetching memes:", error);
        return [];
    }
};

/**
 * Fetch the latest top memes.
 */
export const getCurrentTopMemes = async (): Promise<MemeDataType[]> => {
    // If no memes are found for the requested hour, get the latest available memes

    const snapshot = await db
        .collection("top_memes")
        .orderBy("fetch_timestamp", "desc") // Get the latest timestamped memes
        .orderBy("score", "desc") // Sort by score within the latest timestamp
        .limit(20)
        .get();

    let memes = snapshot.docs.map((doc) => {
        let data = doc.data();

        return {
            ...data,
            fetch_timestamp: data.fetch_timestamp.toDate(), // ✅ Convert to JavaScript Date
            post_timestamp: data.post_timestamp.toDate(),   // ✅ Convert to JavaScript Date
        } as MemeDataType;
    }); return memes;
}