import dotenv from "dotenv";
import admin from "firebase-admin";
dotenv.config();

const firebaseConfig = JSON.parse(process.env.FIREBASE_CREDENTIALS as string);

// Initialize Firebase
admin.initializeApp({
    credential: admin.credential.cert(firebaseConfig),
});

export const db = admin.firestore();
