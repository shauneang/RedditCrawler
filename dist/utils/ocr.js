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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractTextTesseract = void 0;
const tesseract_js_1 = __importDefault(require("tesseract.js"));
const utils_1 = require("./utils");
/**
 * Process an image and extract text using Tesseract.js
 */
const extractTextTesseract = (imagePath) => __awaiter(void 0, void 0, void 0, function* () {
    if ((0, utils_1.isRedditVidUrl)(imagePath)) {
        throw new Error(`❌ Unsupported file type: ${imagePath} is a video, not an image.`);
    }
    console.log(`📸 Processing image: ${imagePath}`);
    const { data } = yield tesseract_js_1.default.recognize(imagePath, "eng", {
        logger: (m) => console.log(`🔄 OCR Progress: ${m.progress * 100}%`), // Logs progress
    });
    const cleanedText = (0, utils_1.cleanText)(data.text);
    console.log("✅ OCR Completed. Extracted text:", cleanedText);
    return cleanedText;
});
exports.extractTextTesseract = extractTextTesseract;
