"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const imgRecog_1 = require("../utils/imgRecog");
const ocr_1 = require("../utils/ocr");
const router = (0, express_1.Router)();
// Test OCR Route
router.get("/ocr", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const extractedText = yield (0, ocr_1.extractTextTesseract)(req.body.imgUrl);
        res.status(201).json({ message: "Extracted text from image.", extractedText });
    }
    catch (error) {
        console.error("❌ Error extracting image from text:", error);
        res.status(500).json({ error: "Error extracting text from image." });
    }
}));
// Test vision Route
router.get("/vision", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const processedImage = yield (0, imgRecog_1.detectLabels)(req.body.imgUrl);
        const extractedText = yield (0, imgRecog_1.extractTextGoogle)(req.body.imgUrl);
        res.status(201).json({ message: "Extracted text from image.", processedImage, extractedText });
    }
    catch (error) {
        console.error("❌ Error extracting image from text:", error);
        res.status(500).json({ error: "Error extracting text from image." });
    }
}));
exports.default = router;
