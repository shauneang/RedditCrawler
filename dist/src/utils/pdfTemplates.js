"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateMemeReportTemplate = void 0;
/**
 * Generates the document definition for the Meme Analysis Report.
 * @param memesTable - List of meme data.
 * @param timestampGraphPath - Path to the Meme Timestamp Distribution graph.
 * @param commentsVsUpvotesGraph - Path to the Comments vs. Upvotes graph.
 * @param votesVsUpvoteRatioGraph - Path to the Votes vs. Upvote Ratio graph.
 * @param postFormatDistributionGraph - Path to the Post Format Distribution graph.
 * @returns The document definition for pdfmake.
 */
const generateMemeReportTemplate = (memesTable, rankedCreatorsTable, keywordsTable, timestampGraphPath, commentsVsUpvotesGraph, votesVsUpvoteRatioGraph, postFormatDistributionGraph, sentimentGraph) => {
    return {
        content: [
            { text: "Meme Analysis Report", style: "header", alignment: "center" },
            { text: `Generated on: ${new Date().toLocaleString()}`, style: "subheader", alignment: "center" },
            { text: "\n" },
            // 🔹 Introduction
            { text: "Introduction", style: "subheader" },
            {
                text: "This report provides an in-depth analysis of the top trending memes, "
                    + "including popularity trends, engagement metrics, format distribution, sentiment analysis, and keyword insights. "
                    + "The goal is to understand meme culture and user engagement based on Reddit data.",
                margin: [0, 5, 0, 15]
            },
            // 🔹 Top Memes Table
            { text: "Top Voted Memes", style: "subheader" },
            { text: "Note: Downvotes show 0, but Upvote_ratio is not 100%. The discrepency exists in the Reddit API itself." },
            { text: "\n" },
            {
                text: "The table below highlights the top 20 memes based on total upvotes. "
                    + "These memes received the highest engagement and represent the most popular trends within the selected timeframe.",
                margin: [0, 5, 0, 10]
            },
            memesTable,
            { text: "\n" },
            // Ranked Creators Table
            { text: "Ranked Meme Creators", style: "subheader" },
            {
                text: "This table ranks creators based on total upvotes, comments, and post count. "
                    + "It highlights the most influential meme makers in the dataset.",
                margin: [0, 5, 0, 10]
            },
            rankedCreatorsTable,
            { text: "\n" },
            // 🔹 Top Keywords Table
            { text: "Top Keywords Extracted", style: "subheader" },
            {
                text: "The following table presents the most frequently used words in meme captions and image text. "
                    + "These keywords provide insights into common themes and trending topics in memes.",
                margin: [0, 5, 0, 10]
            },
            keywordsTable,
            { text: "\n" },
            // 🔹 Meme Timestamp Distribution Graph
            { text: "Meme Timestamp Distribution", style: "subheader" },
            {
                text: "This graph shows when memes were posted throughout the day. "
                    + "It helps identify peak meme activity hours and the best times to post for maximum engagement.",
                margin: [0, 5, 0, 10]
            },
            { image: timestampGraphPath, width: 500, alignment: "center" },
            { text: "\n" },
            // 🔹 Comments vs. Upvotes Graph
            { text: "Comments vs. Upvotes", style: "subheader" },
            {
                text: "This graph explores the relationship between upvotes and comments. "
                    + "It helps determine if highly upvoted memes also attract more discussion, indicating higher engagement.",
                margin: [0, 5, 0, 10]
            },
            { image: commentsVsUpvotesGraph, width: 500, alignment: "center" },
            { text: "\n" },
            // 🔹 Votes vs. Upvote Ratio Graph
            { text: "Votes vs. Upvote Ratio", style: "subheader" },
            {
                text: "This graph compares total votes (upvotes + downvotes) against the upvote ratio. "
                    + "It helps determine if highly voted memes are well-received or controversial.",
                margin: [0, 5, 0, 10]
            },
            { image: votesVsUpvoteRatioGraph, width: 500, alignment: "center" },
            { text: "\n" },
            // 🔹 Post Format Distribution Graph
            { text: "Post Format Distribution", style: "subheader" },
            {
                text: "This graph categorizes memes into different formats (images, videos, GIFs). "
                    + "It helps track which meme formats are most popular and how users engage with different media types.",
                margin: [0, 5, 0, 10]
            },
            { image: postFormatDistributionGraph, width: 500, alignment: "center" },
            { text: "\n" },
            // 🔹 Sentiment Analysis Graph
            { text: "Sentiment Distribution", style: "subheader" },
            {
                text: "This graph categorizes memes based on sentiment (positive, neutral, negative). "
                    + "It helps analyze whether trending memes are uplifting, controversial, or neutral in tone.",
                margin: [0, 5, 0, 10]
            },
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
exports.generateMemeReportTemplate = generateMemeReportTemplate;
