import vision from "@google-cloud/vision";

// Initialize Google Vision client
const client = new vision.ImageAnnotatorClient();

/**
 * Detect objects and themes from an image using Google Vision API
 */
export const analyzeMemeImage = async (imageUrl: string) => {
    const [result] = await client.labelDetection(imageUrl);
    const labels = result.labelAnnotations?.map((label) => label.description) || [];

    return labels;
};