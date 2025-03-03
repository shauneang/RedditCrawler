
/**
 * Returns the current hour's timestamp.
 */
export const getHourlyTimestamp = (): Date => {
    const now = new Date();
    now.setMinutes(0, 0, 0);
    return now;
};

/**
 * Cleans text by removing common escape characters.
 */
export const cleanText = (text: string): string => {
    return text
        .replace(/\n/g, " ") // Replace new lines with space
        .replace(/\t/g, " ") // Replace tabs with space
        .replace(/\r/g, "")  // Remove carriage returns
        .replace(/\b/g, "")  // Remove backspaces
        .replace(/\f/g, "")  // Remove form feeds
        .replace(/\v/g, "")  // Remove vertical tabs
        .replace(/\\'/g, "'") // Unescape single quotes
        .replace(/\\"/g, '"') // Unescape double quotes
        .replace(/\\\\/g, "\\") // Unescape backslashes
        .trim(); // Remove leading and trailing spaces
};

/**
 * Verify reddit image link
 */
export const isRedditVidUrl = (url: string): boolean => {
    return url.startsWith("https://v.redd.it");

}