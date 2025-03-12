"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTempGoogleCredentials = createTempGoogleCredentials;
exports.createTempFirebaseCredentials = createTempFirebaseCredentials;
const dotenv_1 = __importDefault(require("dotenv"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config(); // Load .env variables in local development
function createTempGoogleCredentials() {
    const credentialsPath = path_1.default.join('/tmp', 'gcp-credentials.json'); // Works on Vercel
    if (!process.env.GOOGLE_CREDENTIALS_JSON) {
        throw new Error("GOOGLE_CREDENTIALS_JSON is not set");
    }
    // Write JSON credentials to a temp file
    fs_1.default.writeFileSync(credentialsPath, process.env.GOOGLE_CREDENTIALS_JSON);
    // Set the environment variable dynamically
    process.env.GOOGLE_APPLICATION_CREDENTIALS = credentialsPath;
    return credentialsPath;
}
function createTempFirebaseCredentials() {
    const credentialsPath = path_1.default.join('/tmp', 'firebase-credentials.json'); // Works on Vercel
    if (!process.env.FIREBASE_CREDENTIALS_JSON) {
        throw new Error("FIREBASE_CREDENTIALS_JSON is not set");
    }
    // Write JSON credentials to a temp file
    fs_1.default.writeFileSync(credentialsPath, process.env.FIREBASE_CREDENTIALS_JSON);
    // Set the environment variable dynamically
    process.env.FIREBASE_CREDENTIALS = credentialsPath;
    return credentialsPath;
}
