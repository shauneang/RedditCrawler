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
exports.extractTextGoogle = exports.detectLabels = void 0;
const vision_1 = require("@google-cloud/vision");
const dotenv_1 = __importDefault(require("dotenv"));
const utils_1 = require("./utils");
dotenv_1.default.config();
// Initialize Google Vision client
const client = new vision_1.ImageAnnotatorClient();
const projectId = process.env.GOOGLE_CLOUD_PROJECT_ID;
/**
 * Detect labels (objects, categories) in an image.
 * @param imageUrl - The URL of the image.
 * @returns List of detected labels.
 */
const detectLabels = (imageUrl) => __awaiter(void 0, void 0, void 0, function* () {
    const [result] = yield client.labelDetection(imageUrl);
    if (!result.labelAnnotations) {
        return [];
    }
    const labels = result.labelAnnotations.map(label => label.description).filter(label => Boolean(label)) || [];
    return labels;
});
exports.detectLabels = detectLabels;
/**
 * Perform OCR to extract text from an image.
 * @param imageUrl - The URL of the image.
 * @returns Extracted text from the image.
 */
const extractTextGoogle = (imageUrl) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const [result] = yield client.textDetection(imageUrl);
    const cleanedText = (0, utils_1.cleanText)((_c = (_b = (_a = result.textAnnotations) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.description) !== null && _c !== void 0 ? _c : "");
    return cleanedText;
});
exports.extractTextGoogle = extractTextGoogle;
