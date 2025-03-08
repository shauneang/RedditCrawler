"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isRedditVidUrl = exports.cleanText = exports.getHourlyTimestamp = void 0;
/**
 * Returns the current hour's timestamp.
 */
const getHourlyTimestamp = () => {
    const now = new Date();
    now.setMinutes(0, 0, 0);
    return now;
};
exports.getHourlyTimestamp = getHourlyTimestamp;
/**
 * Cleans text by removing common escape characters.
 */
const cleanText = (text) => {
    return text
        .replace(/\n/g, " ") // Replace new lines with space
        .replace(/\t/g, " ") // Replace tabs with space
        .replace(/\r/g, "") // Remove carriage returns
        .replace(/\b/g, "") // Remove backspaces
        .replace(/\f/g, "") // Remove form feeds
        .replace(/\v/g, "") // Remove vertical tabs
        .replace(/\\'/g, "'") // Unescape single quotes
        .replace(/\\"/g, '"') // Unescape double quotes
        .replace(/\\\\/g, "\\") // Unescape backslashes
        .trim(); // Remove leading and trailing spaces
};
exports.cleanText = cleanText;
/**
 * Verify reddit image link
 */
const isRedditVidUrl = (url) => {
    return url.startsWith("https://v.redd.it");
};
exports.isRedditVidUrl = isRedditVidUrl;
