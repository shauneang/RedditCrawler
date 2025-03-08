"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const fs_1 = __importDefault(require("fs"));
const credentials_1 = require("./utils/credentials");
dotenv_1.default.config();
(0, credentials_1.createTempFirebaseCredentials)();
const firebaseCredentialsPath = process.env.FIREBASE_CREDENTIALS;
if (!firebaseCredentialsPath) {
    console.error("❌ Missing FIREBASE_CREDENTIALS in .env file.");
    process.exit(1);
}
const firebaseConfig = JSON.parse(fs_1.default.readFileSync(firebaseCredentialsPath, "utf8"));
// Initialize Firebase
firebase_admin_1.default.initializeApp({
    credential: firebase_admin_1.default.credential.cert(firebaseConfig),
});
exports.db = firebase_admin_1.default.firestore();
