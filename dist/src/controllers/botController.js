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
exports.packageMemeData = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const reportServices_1 = require("../services/reportServices");
const utils_1 = require("../utils/utils");
/**
 * Fetch top memes from Firestore and package them into a JSON file.
 * @returns {Promise<string>} - File path of the generated JSON file.
 */
const packageMemeData = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const latestHour = (0, utils_1.getHourlyTimestamp)();
        let memes = yield (0, reportServices_1.getHourlyTopMemes)(latestHour);
        memes = memes.length == 0 ? yield (0, reportServices_1.getCurrentTopMemes)() : memes;
        if (memes.length === 0) {
            console.log("⚠️ No memes found, returning empty JSON.");
            return "";
        }
        // Define file path
        const filePath = path_1.default.join(__dirname, "../../latest_memes.json");
        // Write memes to JSON file
        fs_1.default.writeFileSync(filePath, JSON.stringify(memes, null, 2), "utf-8");
        console.log(`✅ Memes saved to ${filePath}`);
        return filePath; // Return path for Telegram bot
    }
    catch (error) {
        console.error("❌ Error packaging memes into JSON:", error);
        return "";
    }
});
exports.packageMemeData = packageMemeData;
