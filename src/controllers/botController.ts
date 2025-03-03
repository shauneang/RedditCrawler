import fs from "fs";
import path from "path";
import { getHourlyTopMemes } from "../services/reportServices";
import { getHourlyTimestamp } from "../utils/utils";

/**
 * Fetch top memes from Firestore and package them into a JSON file.
 * @returns {Promise<string>} - File path of the generated JSON file.
 */
export const packageMemeData = async (): Promise<string> => {
    try {
        const latestHour = getHourlyTimestamp();
        const memes = await getHourlyTopMemes(latestHour);

        if (memes.length === 0) {
            console.log("⚠️ No memes found, returning empty JSON.");
            return "";
        }

        // Define file path
        const filePath = path.join(__dirname, "../../latest_memes.json");

        // Write memes to JSON file
        fs.writeFileSync(filePath, JSON.stringify(memes, null, 2), "utf-8");

        console.log(`✅ Memes saved to ${filePath}`);
        return filePath; // Return path for Telegram bot
    } catch (error) {
        console.error("❌ Error packaging memes into JSON:", error);
        return "";
    }
};