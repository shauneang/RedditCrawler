import nlp from "compromise";
import Sentiment from "sentiment";

/**
 * Ranks words by importance based on their linguistic role.
 * @param text The input text.
 * @returns An array of words ranked by importance.
 */
export const extractKeywords = (text: string) => {
    const doc = nlp(text);

    // Extract words categorized by their types
    const nouns = doc.nouns().out("array");
    const verbs = doc.verbs().out("array");
    const adjectives = doc.adjectives().out("array");

    // Assign importance weights
    const wordScores: Record<string, number> = {};

    nouns.forEach((word: string) => (wordScores[word] = (wordScores[word] || 0) + 3));
    verbs.forEach((word: string) => (wordScores[word] = (wordScores[word] || 0) + 2));
    adjectives.forEach((word: string) => (wordScores[word] = (wordScores[word] || 0) + 1));

    // Sort words by importance score (highest first)
    return Object.entries(wordScores)
        .sort((a, b) => b[1] - a[1]) // Sort descending by score
        .map(([word, score]) => ({ word, score }));
};


const sentiment = new Sentiment();

/**
 * Analyzes the sentiment of a given text.
 * @param {string} text - The input text.
 * @returns {object} - Sentiment score.
 */
export const analyseSentiment = (text: string) => {
    return sentiment.analyze(text);
};