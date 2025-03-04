import { ImageAnnotatorClient } from "@google-cloud/vision";
import dotenv from 'dotenv';
import { cleanText } from "./utils";

dotenv.config();

// Initialize Google Vision client
const client = new ImageAnnotatorClient();
const projectId = process.env.GOOGLE_CLOUD_PROJECT_ID;

/**
 * Detect labels (objects, categories) in an image.
 * @param imageUrl - The URL of the image.
 * @returns List of detected labels.
 */
export const detectLabels = async (imageUrl: string): Promise<string[]> => {
    const [result] = await client.labelDetection(imageUrl);
    if (!result.labelAnnotations) {
        return [];
    }
    const labels: any = result.labelAnnotations.map(label => label.description).filter(label => Boolean(label)) || [];
    return labels;
};

/**
 * Perform OCR to extract text from an image.
 * @param imageUrl - The URL of the image.
 * @returns Extracted text from the image.
 */
export const extractTextGoogle = async (imageUrl: string): Promise<string> => {
    const [result] = await client.textDetection(imageUrl);
    const cleanedText = cleanText(result.textAnnotations?.[0]?.description ?? "")
    return cleanedText;
};