import cors from "cors";
import dotenv from "dotenv";
import express, { Request, Response } from "express";
import cron from "node-cron";
import "./src/bot/topMemesBot";
import scrapeRoutes from "./src/routes/crawlerRoutes";
import testRoutes from "./src/routes/testRoutes";
import { fetchAndStoreTopMemes } from "./src/services/crawlerServices";
import "./src/utils/credentials";
import { createTempGoogleCredentials } from "./src/utils/credentials";

cron.schedule("0 * * * *", async () => {
    console.log(`⏳ Fetching memes at ${new Date().toISOString()}`);
    await fetchAndStoreTopMemes();
});

dotenv.config();
createTempGoogleCredentials();

const app = express();
app.use(express.json());
app.use(cors());

// Register API routes
app.use("/scrape", scrapeRoutes);
// app.use("/api", reportRoutes);
app.use("/test", testRoutes);

app.get("/", async (req: Request, res: Response) => { res.status(200).json({ message: "Hello World." }) })

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});