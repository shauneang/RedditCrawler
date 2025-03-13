import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config(); // Load .env variables in local development

export function createTempGoogleCredentials() {
    const credentialsPath = path.join('/tmp', 'gcp-credentials.json'); // Works on Vercel

    if (!process.env.GOOGLE_CREDENTIALS_JSON) {
        throw new Error("GOOGLE_CREDENTIALS_JSON is not set");
    }

    // Write JSON credentials to a temp file
    fs.writeFileSync(credentialsPath, process.env.GOOGLE_CREDENTIALS_JSON);

    // Set the environment variable dynamically
    process.env.GOOGLE_APPLICATION_CREDENTIALS = credentialsPath;
    return credentialsPath;
}

export function createTempFirebaseCredentials() {
    const credentialsPath = path.join('/tmp', 'firebase-credentials.json'); // Works on Vercel

    if (!process.env.FIREBASE_CREDENTIALS_JSON) {
        throw new Error("FIREBASE_CREDENTIALS_JSON is not set");
    }

    // Write JSON credentials to a temp file
    fs.writeFileSync(credentialsPath, process.env.FIREBASE_CREDENTIALS_JSON);

    // Set the environment variable dynamically
    process.env.FIREBASE_CREDENTIALS = credentialsPath;
    return credentialsPath;
}
