import dotenv from "dotenv";
import admin from "firebase-admin";
import fs from 'fs';
import { createTempFirebaseCredentials } from "./utils/credentials";
dotenv.config();

createTempFirebaseCredentials();

const firebaseCredentialsPath = process.env.FIREBASE_CREDENTIALS;

if (!firebaseCredentialsPath) {
    console.error("❌ Missing FIREBASE_CREDENTIALS in .env file.");
    process.exit(1);
}

const firebaseConfig = JSON.parse(fs.readFileSync(firebaseCredentialsPath, "utf8"));

// Initialize Firebase
admin.initializeApp({
    credential: admin.credential.cert(firebaseConfig),
});

export const db = admin.firestore();
