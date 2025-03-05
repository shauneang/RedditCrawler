import { Content, TDocumentDefinitions } from "pdfmake/interfaces";

/**
 * Generates the document definition for the Meme Analysis Report.
 * @param memesTable - List of meme data.
 * @param timestampGraphPath - Path to the Meme Timestamp Distribution graph.
 * @param commentsVsUpvotesGraph - Path to the Comments vs. Upvotes graph.
 * @param votesVsUpvoteRatioGraph - Path to the Votes vs. Upvote Ratio graph.
 * @param postFormatDistributionGraph - Path to the Post Format Distribution graph.
 * @returns The document definition for pdfmake.
 */
export const generateMemeReportTemplate = (
    memesTable: Content,
    keywordsTable: Content,
    timestampGraphPath: string,
    commentsVsUpvotesGraph: string,
    votesVsUpvoteRatioGraph: string,
    postFormatDistributionGraph: string,
    sentimentGraph: string
): TDocumentDefinitions => {
    return {
        content: [
            { text: "Meme Analysis Report", style: "header", alignment: "center" },
            { text: `Generated on: ${new Date().toLocaleString()}`, style: "subheader" },
            { text: "\n" },

            { text: "Top Voted Memes", style: "subheader" },
            // Top Memes Table
            memesTable,
            { text: "\n" },
            { text: "Top Keywords Extracted", style: "subheader" },
            // Top Keywords Table
            keywordsTable,

            { text: "\n" },
            { text: "Meme Timestamp Distribution", style: "subheader" },
            {
                image: timestampGraphPath,
                width: 500,
                alignment: "center",
            },
            { text: "\n" },
            { text: "Comments vs. Upvotes", style: "subheader" },
            { image: commentsVsUpvotesGraph, width: 500, alignment: "center" },

            { text: "\n" },
            { text: "Votes vs. Upvote Ratio", style: "subheader" },
            { image: votesVsUpvoteRatioGraph, width: 500, alignment: "center" },

            { text: "\n" },
            { text: "Post Format Distribution", style: "subheader" },
            { image: postFormatDistributionGraph, width: 500, alignment: "center" },

            { text: "\n" },
            { text: "Sentiment Distribution", style: "subheader" },
            { image: sentimentGraph, width: 500, alignment: "center" },
        ],
        styles: {
            header: { fontSize: 20, bold: true },
            subheader: { fontSize: 14, bold: true },
        },
        defaultStyle: {
            font: "Helvetica"
        }
    };
};