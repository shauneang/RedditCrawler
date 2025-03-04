import Tesseract from "tesseract.js";
import { cleanText, isRedditVidUrl } from "./utils";

/**
 * Process an image and extract text using Tesseract.js
 */
export const extractTextTesseract = async (imagePath: string) => {
    if (isRedditVidUrl(imagePath)) {
        throw new Error(`❌ Unsupported file type: ${imagePath} is a video, not an image.`);
    }

    console.log(`📸 Processing image: ${imagePath}`);

    const { data } = await Tesseract.recognize(imagePath, "eng", {
        logger: (m) => console.log(`🔄 OCR Progress: ${m.progress * 100}%`), // Logs progress
    });

    const cleanedText: string = cleanText(data.text);

    console.log("✅ OCR Completed. Extracted text:", cleanedText);
    return cleanedText;
};