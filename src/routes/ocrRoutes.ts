import { Request, Response, Router } from "express";
import { extractTextFromImage } from "../utils/ocr";

const router = Router();

// Test OCR Route
router.get("/test", async (req: Request, res: Response) => {
    try {
        const extractedText: string = await extractTextFromImage(req.body.imgUrl);
        res.status(201).json({ message: "Extracted text from image.", extractedText });
    }
    catch (error) {
        console.error("❌ Error extracting image from text:", error);
        res.status(500).json({ error: "Error extracting text from image." });
    }
})

export default router;