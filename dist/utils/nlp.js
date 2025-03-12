"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyseSentiment = exports.extractKeywords = void 0;
const compromise_1 = __importDefault(require("compromise"));
const sentiment_1 = __importDefault(require("sentiment"));
/**
 * Ranks words by importance based on their linguistic role.
 * @param text The input text.
 * @returns An array of words ranked by importance.
 */
const extractKeywords = (text) => {
    const doc = (0, compromise_1.default)(text);
    // Extract words categorized by their types
    const nouns = doc.nouns().out("array");
    const verbs = doc.verbs().out("array");
    const adjectives = doc.adjectives().out("array");
    // Assign importance weights
    const wordScores = {};
    nouns.forEach((word) => (wordScores[word] = (wordScores[word] || 0) + 3));
    verbs.forEach((word) => (wordScores[word] = (wordScores[word] || 0) + 2));
    adjectives.forEach((word) => (wordScores[word] = (wordScores[word] || 0) + 1));
    // Sort words by importance score (highest first)
    return Object.entries(wordScores)
        .sort((a, b) => b[1] - a[1]) // Sort descending by score
        .map(([word, score]) => ({ word, score }));
};
exports.extractKeywords = extractKeywords;
const sentiment = new sentiment_1.default();
/**
 * Analyzes the sentiment of a given text.
 * @param {string} text - The input text.
 * @returns {object} - Sentiment score.
 */
const analyseSentiment = (text) => {
    return sentiment.analyze(text);
};
exports.analyseSentiment = analyseSentiment;
