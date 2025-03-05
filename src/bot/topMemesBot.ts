import dotenv from "dotenv";
import fs from "fs";
import TelegramBot from "node-telegram-bot-api";
import { packageMemeData } from "../controllers/botController";
import { generateReport, getCurrentTopMemes, getHourlyTopMemes } from "../services/reportServices";
import { MemeDataType } from "../type/redditTypes";
import { getHourlyTimestamp } from "../utils/utils";

dotenv.config();

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

if (!TELEGRAM_BOT_TOKEN) {
    console.error("TELEGRAM_BOT_TOKEN is missing. Please check your .env file.");
    process.exit(1);
}

const bot = new TelegramBot(TELEGRAM_BOT_TOKEN, { polling: true });

bot.onText(/\/getreport/, async (msg) => {
    const chatId = msg.chat.id;
    console.log(`📨 [Bot] Received command: /getreport from chat ID: ${chatId}`);

    bot.sendMessage(chatId, "Generating your report... Please wait.");

    try {
        const latestHour = getHourlyTimestamp();
        let memes: MemeDataType[] = await getHourlyTopMemes(latestHour);
        memes = memes.length == 0 ? await getCurrentTopMemes() : memes

        const filePath = await generateReport(memes);
        console.log(`📂 [Bot] Report generated at: ${filePath}`);

        const fileStream = fs.createReadStream(filePath);
        bot.sendDocument(chatId, fileStream, {
            caption: "📎 Here is your report!"
        });

        console.log(`✅ [Bot] Report successfully sent to chat ID: ${chatId}`);

        // Delete the file after sending
        setTimeout(() => {
            fs.unlinkSync(filePath);
            console.log(`🗑️ [Bot] Deleted report file: ${filePath}`);
        }, 5000);
    } catch (error) {
        bot.sendMessage(chatId, "❌ Error generating report.");
        console.error("❌ [Bot] Error generating report:", error);
    }
});

bot.onText(/\/getdata/, async (msg) => {
    const chatId = msg.chat.id;
    console.log(`📨 [Bot] Received command: /getdata from chat ID: ${chatId}`);

    bot.sendMessage(chatId, "Fetching top 20 memes from Reddit...");

    try {
        const filePath = await packageMemeData();

        if (!filePath) {
            throw new Error("⚠️ No memes found in the last 24 hours.");
        }

        console.log(`📂 [Bot] Data package created at: ${filePath}`);

        const fileStream = fs.createReadStream(filePath);
        bot.sendDocument(chatId, fileStream, {
            caption: "📊 Here is your data!"
        });

        console.log(`✅ [Bot] Data successfully sent to chat ID: ${chatId}`);

        // Delete the file after sending
        setTimeout(() => {
            fs.unlinkSync(filePath);
            console.log(`🗑️ [Bot] Deleted meme data file: ${filePath}`);
        }, 5000);
    } catch (error) {
        bot.sendMessage(chatId, "❌ Error retrieving data.");
        console.error("❌ [Bot] Error retrieving meme data:", error);
    }
});

bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    const welcomeMessage = `
    👋 **Welcome to Meme Analytics Bot!** 🎭📊

    I help analyze trending **Reddit memes** using AI, NLP, and data visualization! 🚀

    🔹 **What I Can Do:**
    📊 **/getreport** → Get a detailed **Meme Analysis Report (PDF)**
    📂 **/getdata** → Fetch the **Top 20 Trending Memes (JSON)**

    💡 **Tip:** Try \`/ getreport\` to see insights like **sentiment analysis, engagement trends, and meme formats!**

    🔍 Have fun exploring meme culture! 🎉
    `

    bot.sendMessage(chatId, welcomeMessage, { parse_mode: "Markdown" });
});

console.log("🤖 Telegram bot is running...");