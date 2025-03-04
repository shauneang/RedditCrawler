import { ChartConfiguration, ChartType } from "chart.js";
import { ChartJSNodeCanvas } from "chartjs-node-canvas";
import fs from "fs";
import path from "path";
import { Content, TableCell } from "pdfmake/interfaces";
import { MemeDataType } from "../type/redditTypes";
import { sortByUpvotes } from "./memes";

/**
 * Initialize ChartJS Node Canvas
 */
const width = 800;
const height = 400;
const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height });

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
export const generateChart = async (
    labels: string[],
    data: number[],
    title: string,
    chartType: ChartType,
    scaleType: 'linear' | 'category' = 'linear',
    xLabel: string,
    yLabel: string
): Promise<string> => {
    const chartsDir = path.join(__dirname, "../../charts");

    // ✅ Ensure the `charts/` directory exists
    if (!fs.existsSync(chartsDir)) {
        fs.mkdirSync(chartsDir, { recursive: true });
    }

    const chartConfig: ChartConfiguration<ChartType> = {
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
                    type: scaleType, // ✅ Force evenly spaced categorical labels
                    title: {
                        display: true,
                        text: xLabel, // ✅ X-Axis Label
                        font: { size: 14 },
                    },
                    ticks: {
                        autoSkip: false, // ✅ Ensures all labels are displayed
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

    const imagePath = path.join(chartsDir, `${title.replace(/\s+/g, "_")}.png`);
    const buffer = await chartJSNodeCanvas.renderToBuffer(chartConfig);
    fs.writeFileSync(imagePath, buffer);
    return imagePath;
};

/**
 * Generates the top 20 memes table content for `pdfmake`
 */
export const generateTopMemesTable = (memes: any[]): Content => {
    const sortedMemes: MemeDataType[] = sortByUpvotes(memes, "dsc")
    const headers: TableCell[] = [
        { text: "Rank", bold: true },
        { text: "Title", bold: true },
        { text: "Author", bold: true },
        { text: "Upvotes", bold: true },
        { text: "Downvotes", bold: true },
        { text: "Ratio", bold: true },
        { text: "Comments", bold: true },
    ];

    const rows: TableCell[][] = sortedMemes.map((meme, index) => [
        index + 1,
        meme.title,
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

/**
 * Generates a multi-line graph and returns the path to the image.
 */
export const generateMultiLineGraph = async (
    title: string,
    labels: string[],
    datasets: any[],
    chartType: ChartType
): Promise<string> => {
    const chartsDir = path.join(__dirname, "../../charts");

    // ✅ Ensure `charts/` directory exists
    if (!fs.existsSync(chartsDir)) {
        fs.mkdirSync(chartsDir, { recursive: true });
    }

    const chartConfig: ChartConfiguration = {
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
    };

    const imagePath = path.join(chartsDir, `${title.replace(/\s+/g, "_")}.png`);
    console.log(`Saving chart at: ${imagePath}`);
    const buffer = await chartJSNodeCanvas.renderToBuffer(chartConfig);
    fs.writeFileSync(imagePath, buffer);
    return imagePath;
};

/**
 * Generates hourly data for graphing.
 * @param memes List of memes
 * @returns Data for 3-line graph (votes, comments, upvote ratio per hour)
 */
export const generateHourlyGraphData = (memes: any[]) => {
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
        if (hourlyCountRatios[i] > 0) hourlyVoteRatios[i] /= hourlyCountRatios[i];
    });

    return { hours, hourlyVotes, hourlyComments, hourlyVoteRatios, hourlyCountRatios };
};

export const generateTimestampGraph = async (memes: MemeDataType[]): Promise<string> => {
    const { hours, hourlyVotes, hourlyComments, hourlyVoteRatios } =
        generateHourlyGraphData(memes);

    const timestampGraphPath = await generateMultiLineGraph(
        "Meme Timestamp Distribution",
        hours.map(String),
        [
            { label: "Votes", values: hourlyVotes },
            { label: "Comments", values: hourlyComments },
            { label: "Vote Ratio", values: hourlyVoteRatios },
        ],
        "line"
    );
    return timestampGraphPath
}

/**
 * Generates a graph for Sentiment Score vs. Average Upvotes.
 */
export const generateSentimentGraph = async (memes: MemeDataType[]): Promise<string> => {
    // ✅ Define sentiment categories in order
    const orderedSentimentCategories = [
        "≤-10", "-9", "-8", "-7", "-6", "-5", "-4", "-3", "-2", "-1", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "≥10", "No Score"
    ];

    // ✅ Initialize sentiment data structure
    const sentimentCategories: Record<string, { count: number; upvotes: number }> = {};
    orderedSentimentCategories.forEach(category => {
        sentimentCategories[category] = { count: 0, upvotes: 0 };
    });

    // ✅ Categorize memes based on sentiment score
    memes.forEach(meme => {
        const sentiment = meme.meme_analysis?.sentiment !== undefined ? parseInt(meme.meme_analysis.sentiment) : null;
        let category = "No Score";

        if (typeof sentiment === "number" && !isNaN(sentiment)) {
            if (sentiment <= -10) category = "≤-10";
            else if (sentiment >= 10) category = "≥10";
            else category = sentiment.toString();
        }

        sentimentCategories[category].count++;
        sentimentCategories[category].upvotes += meme.up_votes;
    });

    // ✅ Compute average upvotes per sentiment category in correct order
    const xLabels = orderedSentimentCategories;
    const yValues = xLabels.map(category =>
        sentimentCategories[category].count > 0
            ? sentimentCategories[category].upvotes / sentimentCategories[category].count
            : 0
    );

    return await generateChart(
        xLabels,
        yValues,
        "Sentiment vs. Average Upvotes",
        "bar",
        "category",
        "Sentiment Score",
        "Average Upvotes"
    );
};

/**
 * Generates and returns the file path for the "Votes vs. Comments" graph.
 */
export const generateUpvotesVsCommentsGraph = async (memes: MemeDataType[]): Promise<string> => {
    const sortedMemes = sortByUpvotes(memes);
    const votes = sortedMemes.map(meme => meme.up_votes);
    const comments = sortedMemes.map(meme => meme.num_comments);
    return await generateChart(votes.map(String), comments, "Up Votes vs. Comments", "line", "linear", "Up Votes", "No. Comments");
};

/**
 * Generates and returns the file path for the "Votes vs. Upvote Ratio" graph.
 */
export const generateVotesVsUpvoteRatioGraph = async (memes: MemeDataType[]): Promise<string> => {
    const sortedMemes = sortByUpvotes(memes);

    const votes = sortedMemes.map(meme => meme.up_votes);
    const upvoteRatios = sortedMemes.map(meme => meme.upvote_ratio);
    return await generateChart(votes.map(String), upvoteRatios, "Up Votes vs. Upvote Ratio", "line", "linear", "Up Votes", "Upvote Ratio");
};

/**
 * Generates and returns the file path for the "Post Format Distribution" graph.
 */
export const generatePostFormatDistributionGraph = async (memes: MemeDataType[]): Promise<string> => {
    const formatCounts = { Image: 0, Video: 0, Gif: 0 };

    memes.forEach((meme) => {
        if (meme.post_hint === "image") {
            path.extname(new URL(meme.url).pathname) === ".gif" ? formatCounts.Gif++ : formatCounts.Image++;
        } else {
            formatCounts.Video++;
        }
    });

    return await generateChart(Object.keys(formatCounts), Object.values(formatCounts), "Post Format Distribution", "bar", "category", "Post Format", "No. of Posts");
};