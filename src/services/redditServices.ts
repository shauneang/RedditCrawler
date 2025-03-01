import axios from "axios";
import dotenv from "dotenv";
import puppeteer from "puppeteer";
import { MemeDataType } from "../type/redditTypes";
import { parseMemeData } from "../utils/memes";

dotenv.config();

/**
 * Fetch top memes from r/memes over the past 24 hours
 * @param {number} limit - Number of posts to fetch (default: 10)
 * @returns {Promise<any[]>} - List of top Reddit posts
 */
export const fetchTopMemes = async (limit: number = 20): Promise<MemeDataType[]> => {
    try {
        if (!process.env.REDDIT_MEMES_URL) {
            throw new Error("REDDIT_MEMES_URL environment variable missing");
        }

        const response = await axios.get("https://www.reddit.com/r/memes/top.json", {
            params: {
                limit,
                t: "day", // Get top posts over the past 24 hours
            },
            headers: {
                "User-Agent": "RedditScraper/1.0",
            },
        });

        // Extract and return relevant post data
        return response.data.data.children.map(parseMemeData);
    } catch (error) {
        console.error("Error fetching top memes from Reddit:", error);
        throw new Error("Failed to fetch top memes");
    }
};


/**
 * Scrape top memes from Reddit's r/memes page (without API)
 * @returns {Promise<any[]>} - List of scraped memes
 */
export const scrapeRedditMemes = async (): Promise<any[]> => {
    const url = "https://www.reddit.com/r/memes/top/?t=day"; // Top memes of the day
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    try {
        await page.goto(url, { waitUntil: "domcontentloaded" });

        // Scrape post titles and image URLs
        const memes = await page.evaluate(() => {
            const posts = Array.from(document.querySelectorAll("div.Post"));
            return posts.map((post) => {
                const title = post.querySelector("h3")?.innerText || "No title";
                const imgElement = post.querySelector("img[src^='https://preview.redd.it']") as HTMLImageElement;
                const imgUrl = imgElement ? imgElement.src : null;

                return { title, imgUrl };
            });
        });

        await browser.close();
        return memes;
    } catch (error) {
        console.error("❌ Error scraping Reddit:", error);
        await browser.close();
        return [];
    }
};