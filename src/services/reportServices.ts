import fs from "fs";
import path from "path";
import PdfPrinter from "pdfmake";
import { TDocumentDefinitions } from "pdfmake/interfaces";
import { db } from "../database";
import { MemeDataType } from "../type/redditTypes";
import { generatePostFormatDistributionGraph, generateSentimentGraph, generateTimestampGraph, generateTopMemesTable, generateUpvotesVsCommentsGraph, generateVotesVsUpvoteRatioGraph } from "../utils/pdfHelper";
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

            const timestampGraph = await generateTimestampGraph(memes);
            const memesTable = generateTopMemesTable(memes)
            const commentsVsUpvotesGraph = await generateUpvotesVsCommentsGraph(memes);
            const votesVsUpvoteRatioGraph = await generateVotesVsUpvoteRatioGraph(memes);
            const postFormatDistributionGraph = await generatePostFormatDistributionGraph(memes);
            const sentimentGraph = await generateSentimentGraph(memes);

            // Document Definition for pdfmake
            const docDefinition: TDocumentDefinitions = generateMemeReportTemplate(memesTable, timestampGraph, commentsVsUpvotesGraph, votesVsUpvoteRatioGraph, postFormatDistributionGraph, sentimentGraph)

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

// /**
//  * Generate a valid PDF report and return its file path.
//  */
// export const generateReport = async (memes: any[]): Promise<string> => {
//     return new Promise(async (resolve, reject) => {
//         try {
//             const filePath = path.join(__dirname, "../../top_memes_report.pdf");
//             const doc = new PDFDocument();
//             const stream = fs.createWriteStream(filePath);
//             doc.pipe(stream);

//             // Title
//             doc.fontSize(20).text("📊 Top 20 Reddit Memes Report", { align: "center" });
//             doc.moveDown();
//             doc.fontSize(14).text("Generated on: " + new Date().toLocaleString());
//             doc.moveDown();

//             // Common data
//             const votes: number[] = memes.map(m => m.up_votes);
//             const comments = memes.map(m => m.num_comments);
//             const upvoteRatios = memes.map(m => m.upvote_ratio);

//             // Top 20 Memes Table
//             addTopMemesTable(doc, memes);

//             // Generate hourly data
//             const { hours, hourlyVotes, hourlyComments, hourlyVoteRatios, hourlyCountRatios } = generateHourlyGraphData(memes);
//             console.log(hours, hourlyVotes, hourlyComments, hourlyVoteRatios, hourlyCountRatios)
//             // Add Multi-Line Graph
//             await addMultiLineGraphToPDF(doc, "Meme Timestamp Distribution", hours.map(String), [
//                 { label: "Votes", values: hourlyVotes },
//                 { label: "Comments", values: hourlyComments },
//                 { label: "Vote Ratio", values: hourlyVoteRatios },
//                 { label: "Count", values: hourlyCountRatios }
//             ], "line");

//             // // Votes vs. Comments Graph
//             // await addGraphToPDF(doc, "Comments vs. Upvotes", votes.map(String), comments, "line");

//             // // Votes vs. Upvote Ratio Graph
//             // await addGraphToPDF(doc, "Votes vs. Upvote Ratio", votes.map(String), upvoteRatios, "line");

//             // // Post Format Distribution (Image vs. Video)
//             // const formatCounts = { Image: 0, Video: 0, Gif: 0 };
//             // const countPostFormats = (meme: MemeDataType) => {
//             //     if (meme.post_hint == "image") {
//             //         path.extname(new URL(meme.url).pathname) == ".gif" ? formatCounts.Gif++ : formatCounts.Image++;
//             //     } else {
//             //         formatCounts.Video++;
//             //     }
//             // }
//             // memes.forEach(countPostFormats);
//             // await addGraphToPDF(doc, "Post Format Distribution", Object.keys(formatCounts), Object.values(formatCounts), "line");

//             doc.end();
//             stream.on("finish", () => resolve(filePath));
//             stream.on("error", (err) => reject(err));
//         } catch (error) {
//             reject(error);
//         }
//     });
// };

/**
 * Get top memes for the latest hour from Firestore.
 * If no data exists for the requested hour, fetch the latest available memes.
 */
export const getHourlyTopMemes = async (hour: Date): Promise<MemeDataType[]> => {
    try {
        let snapshot = await db
            .collection("top_memes")
            .where("fetch_timestamp", "==", hour)
            .orderBy("score", "desc") // Sort by score (best memes first)
            .limit(20)
            .get();

        let memes = snapshot.docs.map((doc) => doc.data() as MemeDataType);

        // If no memes are found for the requested hour, get the latest available memes
        if (memes.length === 0) {
            console.log("⚠️ No memes found for the requested hour. Fetching latest available memes...");

            snapshot = await db
                .collection("top_memes")
                .orderBy("fetch_timestamp", "desc") // Get the latest timestamped memes
                .orderBy("score", "desc") // Sort by score within the latest timestamp
                .limit(20)
                .get();

            memes = snapshot.docs.map((doc) => doc.data() as MemeDataType);
        }

        return memes;
    } catch (error) {
        console.error("❌ Error fetching memes:", error);
        return [];
    }
};