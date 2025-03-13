import cors from "cors";
import dotenv from "dotenv";
import express, { Request, Response } from "express";
import cron from "node-cron";
import serverless from "serverless-http"; // Import serverless-http
import "../../src/bot/topMemesBot";
import scrapeRoutes from "../../src/routes/crawlerRoutes";
import testRoutes from "../../src/routes/testRoutes";
import { fetchAndStoreTopMemes } from "../../src/services/crawlerServices";
import "../../src/utils/credentials";
import { createTempGoogleCredentials } from "../../src/utils/credentials";

dotenv.config();
createTempGoogleCredentials();

const app = express();
app.use(express.json());
app.use(cors());

// Register API routes
app.use("/scrape", scrapeRoutes);
app.use("/test", testRoutes);

app.get("/", async (req: Request, res: Response) => {
    res.status(200).json({ message: "Hello from Netlify Serverless Express!" });
});

// Convert Express to a Serverless Function
export const handler = serverless(app);

// Disable cron jobs in a serverless environment (Netlify doesn't support background jobs)
cron.schedule("0 * * * *", async () => {
    console.log(`⏳ Fetching memes at ${new Date().toISOString()}`);
    await fetchAndStoreTopMemes();
});