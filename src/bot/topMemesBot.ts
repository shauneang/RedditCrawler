import dotenv from "dotenv";
import fs from "fs";
import TelegramBot from "node-telegram-bot-api";
import { generateReport, scrapeData } from "../controllers/reportController";

dotenv.config();

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

if (!TELEGRAM_BOT_TOKEN) {
    console.error("TELEGRAM_BOT_TOKEN is missing. Please check your .env file.");
    process.exit(1);
}

const bot = new TelegramBot(TELEGRAM_BOT_TOKEN, { polling: true });

bot.onText(/\/getreport/, async (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, "Generating your report... Please wait.");

    try {
        const filePath = await generateReport();
        const fileStream = fs.createReadStream(filePath);

        // Send the document using the file path
        bot.sendDocument(chatId, fileStream, {
            caption: "📎 Here is your report!" // ✅ Fix for deprecation warning
        });

        // Delete the file after sending
        setTimeout(() => fs.unlinkSync(filePath), 5000);
    } catch (error) {
        bot.sendMessage(chatId, "Error generating report.");
        console.error("Error generating report:", error);
    }
});

bot.onText(/\/getdata/, async (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, "Scrapping reddit for top 20 memes in the past 24 hours.");

    try {
        const filePath = await scrapeData();
        const fileStream = fs.createReadStream(filePath);

        // Send the document using the file path
        bot.sendDocument(chatId, fileStream, {
            caption: "📊 Here is your data!" // ✅ Fix for deprecation warning
        });

        // Delete the file after sending
        setTimeout(() => fs.unlinkSync(filePath), 5000);
    } catch (error) {
        bot.sendMessage(chatId, "Error scrapping data.");
        console.error("Error scrapping data:", error);
    }
});

console.log("🤖 Telegram bot is running...");