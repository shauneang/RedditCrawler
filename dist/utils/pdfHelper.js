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
exports.generateKeywordTable = exports.generatePostFormatDistributionGraph = exports.generateVotesVsUpvoteRatioGraph = exports.generateUpvotesVsCommentsGraph = exports.generateSentimentGraph = exports.generateAggregatedTimestampGraph = exports.generateAggregatedTimestampData = exports.generateTimestampGraph = exports.generateHourlyGraphData = exports.generateMultiLineGraph = exports.generateRankedCreatorsTable = exports.rankCreators = exports.generateTopMemesTable = exports.generateChart = void 0;
const chartjs_node_canvas_1 = require("chartjs-node-canvas");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const reportServices_1 = require("../services/reportServices");
const memes_1 = require("./memes");
/**
 * Initialize ChartJS Node Canvas
 */
const width = 800;
const height = 400;
const chartJSNodeCanvas = new chartjs_node_canvas_1.ChartJSNodeCanvas({ width, height });
/**
 * Generates a chart image.
 * @param labels X-axis labels
 * @param data Y-axis values
 * @param title Chart title
 * @param chartType Type of Chart (bar, line, pie, etc.)
 * @param scaleType: Type of x axis
 * @param xLabel: X axis label
   @param yLabel: Y axis label
 * @returns Path to the generated chart image
 */
const generateChart = (labels_1, data_1, title_1, chartType_1, ...args_1) => __awaiter(void 0, [labels_1, data_1, title_1, chartType_1, ...args_1], void 0, function* (labels, data, title, chartType, scaleType = 'linear', xLabel, yLabel) {
    const chartsDir = path_1.default.join(__dirname, "../../charts");
    // ✅ Ensure the `charts/` directory exists
    if (!fs_1.default.existsSync(chartsDir)) {
        fs_1.default.mkdirSync(chartsDir, { recursive: true });
    }
    const chartConfig = {
        type: chartType,
        data: {
            labels, // ✅ This will now be treated as categorical labels
            datasets: [
                {
                    label: title,
                    data,
                    backgroundColor: "rgba(54, 162, 235, 0.5)",
                    borderColor: "rgba(54, 162, 235, 1)",
                    borderWidth: 2,
                    fill: false,
                },
            ],
        },
        options: {
            plugins: {
                title: {
                    display: true,
                    text: title,
                    font: { size: 16 },
                },
            },
            scales: {
                x: {
                    type: scaleType,
                    title: {
                        display: true,
                        text: xLabel, // ✅ X-Axis Label
                        font: { size: 14 },
                    },
                    ticks: {
                        autoSkip: false,
                    },
                },
                y: {
                    title: {
                        display: true,
                        text: yLabel, // ✅ Y-Axis Label
                        font: { size: 14 },
                    },
                },
            },
        },
    };
    const imagePath = path_1.default.join(chartsDir, `${title.replace(/\s+/g, "_")}.png`);
    const buffer = yield chartJSNodeCanvas.renderToBuffer(chartConfig);
    fs_1.default.writeFileSync(imagePath, buffer);
    return imagePath;
});
exports.generateChart = generateChart;
/**
 * Generates the top 20 memes table content for `pdfmake`
 */
const generateTopMemesTable = (memes) => {
    const sortedMemes = (0, memes_1.sortByUpvotes)(memes, "dsc");
    const headers = [
        { text: "Rank", bold: true },
        { text: "Title", bold: true },
        { text: "Author", bold: true },
        { text: "Upvotes", bold: true },
        { text: "Downvotes", bold: true },
        { text: "Ratio", bold: true },
        { text: "Comments", bold: true },
    ];
    const rows = sortedMemes.map((meme, index) => [
        index + 1,
        {
            text: meme.title,
            link: meme.url, // 🔗 Redirects to meme's original link
            color: "blue", // 💙 Makes it look like a hyperlink
            decoration: "underline", // 🔗 Underline for better visibility
        },
        meme.author,
        meme.up_votes.toString(),
        meme.down_votes.toString(),
        meme.upvote_ratio.toFixed(2),
        meme.num_comments.toString(),
    ]);
    return {
        table: {
            headerRows: 1,
            widths: ["auto", "auto", "auto", "auto", "auto", "auto", "auto"],
            body: [headers, ...rows],
        },
    };
};
exports.generateTopMemesTable = generateTopMemesTable;
/**
 * Aggregates meme data to rank creators based on total upvotes, comments, and post count.
 */
const rankCreators = (memes) => {
    const creatorStats = {};
    // Aggregate stats for each author
    memes.forEach((meme) => {
        if (!creatorStats[meme.author_id]) {
            creatorStats[meme.author_id] = { author: meme.author, total_upvotes: 0, total_comments: 0, post_count: 0 };
        }
        creatorStats[meme.author_id].total_upvotes += meme.up_votes;
        creatorStats[meme.author_id].total_comments += meme.num_comments;
        creatorStats[meme.author_id].post_count += 1;
    });
    // Convert object to array and sort by total_upvotes (highest first)
    return Object.entries(creatorStats)
        .map(([author_id, stats]) => ({
        author: stats.author,
        total_upvotes: stats.total_upvotes,
        total_comments: stats.total_comments,
        post_count: stats.post_count,
    }))
        .sort((a, b) => b.total_upvotes - a.total_upvotes) // Sort by highest upvotes
        .slice(0, 20); // Limit to top 20 creators
};
exports.rankCreators = rankCreators;
/**
 * Generates the Ranked Creators table content for `pdfmake`.
 */
const generateRankedCreatorsTable = (memes) => {
    const rankedCreators = (0, exports.rankCreators)(memes);
    const headers = [
        { text: "Rank", bold: true },
        { text: "Author", bold: true },
        { text: "Total Upvotes", bold: true },
        { text: "Total Comments", bold: true },
        { text: "Post Count", bold: true },
    ];
    const rows = rankedCreators.map((creator, index) => [
        index + 1, // Rank
        creator.author, // Author
        creator.total_upvotes.toString(), // Total Upvotes
        creator.total_comments.toString(), // Total Comments
        creator.post_count.toString(), // Total Posts
    ]);
    return {
        table: {
            headerRows: 1,
            widths: ["auto", "auto", "auto", "auto", "auto"],
            body: [headers, ...rows],
        },
        layout: "lightHorizontalLines",
    };
};
exports.generateRankedCreatorsTable = generateRankedCreatorsTable;
/**
 * Generates a multi-line graph and returns the path to the image.
 */
const generateMultiLineGraph = (title, labels, datasets, chartType, xLabel, yLabel) => __awaiter(void 0, void 0, void 0, function* () {
    const chartsDir = path_1.default.join(__dirname, "../../charts");
    // ✅ Ensure `charts/` directory exists
    if (!fs_1.default.existsSync(chartsDir)) {
        fs_1.default.mkdirSync(chartsDir, { recursive: true });
    }
    const chartConfig = {
        type: chartType,
        data: {
            labels,
            datasets: datasets.map((data, index) => ({
                label: data.label,
                data: data.values,
                borderColor: ["red", "blue", "green"][index], // Line colors
                fill: false,
            })),
        },
        options: {
            scales: {
                x: {
                    type: "linear",
                    title: {
                        display: true,
                        text: xLabel, // ✅ X-Axis Label
                        font: { size: 14 },
                    },
                    ticks: {
                        autoSkip: false,
                    },
                },
                y: {
                    title: {
                        display: true,
                        text: yLabel, // ✅ X-Axis Label
                        font: { size: 14 },
                    },
                }
            }
        }
    };
    const imagePath = path_1.default.join(chartsDir, `${title.replace(/\s+/g, "_")}.png`);
    console.log(`Saving chart at: ${imagePath}`);
    const buffer = yield chartJSNodeCanvas.renderToBuffer(chartConfig);
    fs_1.default.writeFileSync(imagePath, buffer);
    return imagePath;
});
exports.generateMultiLineGraph = generateMultiLineGraph;
/**
 * Generates hourly data for graphing.
 * @param memes List of memes
 * @returns Data for 3-line graph (votes, comments, upvote ratio per hour)
 */
const generateHourlyGraphData = (memes) => {
    // Initialize empty arrays for each hour (0-23)
    const hours = Array.from({ length: 24 }, (_, i) => i); // [0, 1, 2, ..., 23]
    const hourlyVotes = Array(24).fill(0);
    const hourlyComments = Array(24).fill(0);
    const hourlyVoteRatios = Array(24).fill(0);
    const hourlyCountRatios = Array(24).fill(0); // To track how many memes contribute to vote ratio
    memes.forEach(meme => {
        const hour = meme.post_timestamp.toDate().getHours(); // Get hour (0-23)
        hourlyVotes[hour] += meme.up_votes;
        hourlyComments[hour] += meme.num_comments;
        hourlyVoteRatios[hour] += meme.upvote_ratio;
        hourlyCountRatios[hour]++; // Count the number of memes per hour
    });
    // Normalize vote ratio by dividing by count
    hourlyVoteRatios.forEach((_, i) => {
        if (hourlyCountRatios[i] > 0)
            hourlyVoteRatios[i] /= hourlyCountRatios[i];
    });
    return { hours, hourlyVotes, hourlyComments, hourlyVoteRatios, hourlyCountRatios };
};
exports.generateHourlyGraphData = generateHourlyGraphData;
const generateTimestampGraph = (memes) => __awaiter(void 0, void 0, void 0, function* () {
    const { hours, hourlyVotes, hourlyComments, hourlyVoteRatios } = (0, exports.generateHourlyGraphData)(memes);
    const timestampGraphPath = yield (0, exports.generateChart)(hours.map(String), hourlyVotes, "Meme Timestamp Distribution", 
    // [
    //     { label: "Votes", values: hourlyVotes },
    //     { label: "Comments", values: hourlyComments },
    //     { label: "Vote Ratio", values: hourlyVoteRatios },
    // ],
    "line", "category", "Time", "Votes");
    return timestampGraphPath;
});
exports.generateTimestampGraph = generateTimestampGraph;
/**
 * Generate hourly timestamp graph data
 */
const generateAggregatedTimestampData = () => __awaiter(void 0, void 0, void 0, function* () {
    // ✅ Get current time and past 24-hour threshold
    const now = new Date();
    const past24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    // ✅ Initialize a map to store upvote totals per hour
    const hourlyData = {};
    // ✅ Populate hourlyData (0-23 hours)
    for (let hour = 0; hour < 24; hour++) {
        hourlyData[hour] = { upvotes: 0, count: 0 };
    }
    // ✅ Retrieve memes for each of the past 24 hours
    for (let hour = 0; hour < 24; hour++) {
        const targetHour = new Date(now);
        targetHour.setHours(now.getHours() - hour, 0, 0, 0);
        const memes = yield (0, reportServices_1.getHourlyTopMemes)(targetHour);
        // ✅ Filter memes that were posted within the last 24 hours
        memes.forEach(meme => {
            const postHour = meme.post_timestamp.getHours();
            if (meme.post_timestamp >= past24Hours) {
                hourlyData[postHour].upvotes += meme.up_votes;
                hourlyData[postHour].count++;
            }
        });
    }
    // ✅ Calculate average upvotes per hour
    const hours = Array.from({ length: 24 }, (_, i) => i); // [0, 1, ..., 23]
    const avgUpvotes = hours.map(hour => hourlyData[hour].count > 0
        ? hourlyData[hour].upvotes / hourlyData[hour].count
        : 0);
    return { hours, avgUpvotes };
});
exports.generateAggregatedTimestampData = generateAggregatedTimestampData;
/**
 * Generates an hourly timestamp graph with fair distribution of upvotes.
 * @returns The file path of the generated graph.
 */
const generateAggregatedTimestampGraph = () => __awaiter(void 0, void 0, void 0, function* () {
    const width = 800;
    const height = 400;
    const chartJSNodeCanvas = new chartjs_node_canvas_1.ChartJSNodeCanvas({ width, height });
    const { hours, avgUpvotes } = yield (0, exports.generateAggregatedTimestampData)();
    // ✅ Generate the chart
    const chartConfig = {
        type: "line",
        data: {
            labels: hours.map(hour => `${hour}:00`), // Labels: 0:00 - 23:00
            datasets: [
                {
                    label: "Average Upvotes per Hour",
                    data: avgUpvotes,
                    backgroundColor: "rgba(54, 162, 235, 0.5)",
                    borderColor: "rgba(54, 162, 235, 1)",
                    borderWidth: 2,
                    fill: false,
                },
            ],
        },
        options: {
            plugins: {
                title: {
                    display: true,
                    text: "Hourly Average Upvotes (Last 24 Hours)",
                    font: { size: 16 },
                },
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: "Hour of the Day",
                        font: { size: 14 },
                    },
                    ticks: {
                        autoSkip: false,
                    },
                },
                y: {
                    title: {
                        display: true,
                        text: "Average Upvotes",
                        font: { size: 14 },
                    },
                },
            },
        },
    };
    // ✅ Save the chart as an image
    const chartsDir = path_1.default.join(__dirname, "../../charts");
    if (!fs_1.default.existsSync(chartsDir))
        fs_1.default.mkdirSync(chartsDir, { recursive: true });
    const imagePath = path_1.default.join(chartsDir, "Hourly_Average_Upvotes.png");
    const buffer = yield chartJSNodeCanvas.renderToBuffer(chartConfig);
    fs_1.default.writeFileSync(imagePath, buffer);
    return imagePath;
});
exports.generateAggregatedTimestampGraph = generateAggregatedTimestampGraph;
/**
 * Generates a graph for Sentiment Score vs. Average Upvotes.
 */
const generateSentimentGraph = (memes) => __awaiter(void 0, void 0, void 0, function* () {
    // ✅ Define sentiment categories in order
    const orderedSentimentCategories = [
        "≤-10", "-9", "-8", "-7", "-6", "-5", "-4", "-3", "-2", "-1", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "≥10", "No Score"
    ];
    // ✅ Initialize sentiment data structure
    const sentimentCategories = {};
    orderedSentimentCategories.forEach(category => {
        sentimentCategories[category] = { count: 0, upvotes: 0 };
    });
    // ✅ Categorize memes based on sentiment score
    memes.forEach(meme => {
        var _a;
        const sentiment = ((_a = meme.meme_analysis) === null || _a === void 0 ? void 0 : _a.sentiment) !== undefined ? parseInt(meme.meme_analysis.sentiment) : null;
        let category = "No Score";
        if (typeof sentiment === "number" && !isNaN(sentiment)) {
            if (sentiment <= -10)
                category = "≤-10";
            else if (sentiment >= 10)
                category = "≥10";
            else
                category = sentiment.toString();
        }
        sentimentCategories[category].count++;
        sentimentCategories[category].upvotes += meme.up_votes;
    });
    // ✅ Compute average upvotes per sentiment category in correct order
    const xLabels = orderedSentimentCategories;
    const yValues = xLabels.map(category => sentimentCategories[category].count > 0
        ? sentimentCategories[category].upvotes / sentimentCategories[category].count
        : 0);
    return yield (0, exports.generateChart)(xLabels, yValues, "Sentiment vs. Average Upvotes", "bar", "category", "Sentiment Score", "Average Upvotes");
});
exports.generateSentimentGraph = generateSentimentGraph;
/**
 * Generates and returns the file path for the "Votes vs. Comments" graph.
 */
const generateUpvotesVsCommentsGraph = (memes) => __awaiter(void 0, void 0, void 0, function* () {
    const sortedMemes = (0, memes_1.sortByUpvotes)(memes);
    const votes = sortedMemes.map(meme => meme.up_votes);
    const comments = sortedMemes.map(meme => meme.num_comments);
    return yield (0, exports.generateChart)(votes.map(String), comments, "Up Votes vs. Comments", "line", "linear", "Up Votes", "No. Comments");
});
exports.generateUpvotesVsCommentsGraph = generateUpvotesVsCommentsGraph;
/**
 * Generates and returns the file path for the "Votes vs. Upvote Ratio" graph.
 */
const generateVotesVsUpvoteRatioGraph = (memes) => __awaiter(void 0, void 0, void 0, function* () {
    const sortedMemes = (0, memes_1.sortByUpvotes)(memes);
    const votes = sortedMemes.map(meme => meme.up_votes);
    const upvoteRatios = sortedMemes.map(meme => meme.upvote_ratio);
    return yield (0, exports.generateChart)(votes.map(String), upvoteRatios, "Up Votes vs. Upvote Ratio", "line", "linear", "Up Votes", "Upvote Ratio");
});
exports.generateVotesVsUpvoteRatioGraph = generateVotesVsUpvoteRatioGraph;
/**
 * Generates and returns the file path for the "Post Format Distribution" graph.
 */
const generatePostFormatDistributionGraph = (memes) => __awaiter(void 0, void 0, void 0, function* () {
    const formatCounts = { Image: 0, Video: 0, Gif: 0 };
    memes.forEach((meme) => {
        if (meme.post_hint === "image") {
            path_1.default.extname(new URL(meme.url).pathname) === ".gif" ? formatCounts.Gif++ : formatCounts.Image++;
        }
        else {
            formatCounts.Video++;
        }
    });
    return yield (0, exports.generateChart)(Object.keys(formatCounts), Object.values(formatCounts), "Post Format Distribution", "bar", "category", "Post Format", "No. of Posts");
});
exports.generatePostFormatDistributionGraph = generatePostFormatDistributionGraph;
/**
 * Generates a table of top keywords for pdfmake.
 * @param memes - List of memes.
 * @returns Table content for pdfmake.
 */
const generateKeywordTable = (memes) => {
    const topKeywords = (0, memes_1.generateTopKeywords)(memes, 2); // Get keywords appearing at least 3 times
    // ✅ Define table headers
    const headers = [
        { text: "Keyword", bold: true },
        { text: "Count", bold: true }
    ];
    // ✅ Create table rows
    const rows = topKeywords.map(({ word, count }) => [word, count.toString()]);
    return {
        table: {
            headerRows: 1,
            widths: ["70%", "30%"], // Column widths (Keyword: 70%, Count: 30%)
            body: [headers, ...rows]
        },
        layout: "lightHorizontalLines", // ✅ Adds horizontal lines for readability
    };
};
exports.generateKeywordTable = generateKeywordTable;
