import { Request, Response, Router } from "express";
import { detectLabels, extractTextGoogle } from "../utils/imgRecog";
import { extractTextTesseract } from "../utils/ocr";

const router = Router();

// Test OCR Route
router.get("/ocr", async (req: Request, res: Response) => {
    try {
        const extractedText: string = await extractTextTesseract(req.body.imgUrl);
        res.status(201).json({ message: "Extracted text from image.", extractedText });
    }
    catch (error) {
        console.error("❌ Error extracting image from text:", error);
        res.status(500).json({ error: "Error extracting text from image." });
    }
})

// Test vision Route
router.get("/vision", async (req: Request, res: Response) => {
    try {
        const processedImage: any = await detectLabels(req.body.imgUrl);
        const extractedText: string = await extractTextGoogle(req.body.imgUrl);
        res.status(201).json({ message: "Extracted text from image.", processedImage, extractedText });
    }
    catch (error) {
        console.error("❌ Error extracting image from text:", error);
        res.status(500).json({ error: "Error extracting text from image." });
    }
})
export default router;