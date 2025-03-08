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
const dotenv_1 = __importDefault(require("dotenv"));
const fs_1 = __importDefault(require("fs"));
const node_telegram_bot_api_1 = __importDefault(require("node-telegram-bot-api"));
const botController_1 = require("../controllers/botController");
const reportServices_1 = require("../services/reportServices");
const utils_1 = require("../utils/utils");
dotenv_1.default.config();
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
if (!TELEGRAM_BOT_TOKEN) {
    console.error("TELEGRAM_BOT_TOKEN is missing. Please check your .env file.");
    process.exit(1);
}
const bot = new node_telegram_bot_api_1.default(TELEGRAM_BOT_TOKEN, { polling: true });
bot.onText(/\/getreport/, (msg) => __awaiter(void 0, void 0, void 0, function* () {
    const chatId = msg.chat.id;
    console.log(`📨 [Bot] Received command: /getreport from chat ID: ${chatId}`);
    bot.sendMessage(chatId, "Generating your report... Please wait.");
    try {
        const latestHour = (0, utils_1.getHourlyTimestamp)();
        let memes = yield (0, reportServices_1.getHourlyTopMemes)(latestHour);
        memes = memes.length == 0 ? yield (0, reportServices_1.getCurrentTopMemes)() : memes;
        const filePath = yield (0, reportServices_1.generateReport)(memes);
        console.log(`📂 [Bot] Report generated at: ${filePath}`);
        const fileStream = fs_1.default.createReadStream(filePath);
        bot.sendDocument(chatId, fileStream, {
            caption: "📎 Here is your report!"
        });
        console.log(`✅ [Bot] Report successfully sent to chat ID: ${chatId}`);
        // Delete the file after sending
        setTimeout(() => {
            fs_1.default.unlinkSync(filePath);
            console.log(`🗑️ [Bot] Deleted report file: ${filePath}`);
        }, 5000);
    }
    catch (error) {
        bot.sendMessage(chatId, "❌ Error generating report.");
        console.error("❌ [Bot] Error generating report:", error);
    }
}));
bot.onText(/\/getdata/, (msg) => __awaiter(void 0, void 0, void 0, function* () {
    const chatId = msg.chat.id;
    console.log(`📨 [Bot] Received command: /getdata from chat ID: ${chatId}`);
    bot.sendMessage(chatId, "Fetching top 20 memes from Reddit...");
    try {
        const filePath = yield (0, botController_1.packageMemeData)();
        if (!filePath) {
            throw new Error("⚠️ No memes found in the last 24 hours.");
        }
        console.log(`📂 [Bot] Data package created at: ${filePath}`);
        const fileStream = fs_1.default.createReadStream(filePath);
        bot.sendDocument(chatId, fileStream, {
            caption: "📊 Here is your data!"
        });
        console.log(`✅ [Bot] Data successfully sent to chat ID: ${chatId}`);
        // Delete the file after sending
        setTimeout(() => {
            fs_1.default.unlinkSync(filePath);
            console.log(`🗑️ [Bot] Deleted meme data file: ${filePath}`);
        }, 5000);
    }
    catch (error) {
        bot.sendMessage(chatId, "❌ Error retrieving data.");
        console.error("❌ [Bot] Error retrieving meme data:", error);
    }
}));
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
    `;
    bot.sendMessage(chatId, welcomeMessage, { parse_mode: "Markdown" });
});
console.log("🤖 Telegram bot is running...");
