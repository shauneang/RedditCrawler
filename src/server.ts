import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import cron from "node-cron";
import "./bot/topMemesBot";
import scrapeRoutes from "./routes/crawlerRoutes";
import reportRoutes from "./routes/reportRoutes";
import testRoutes from "./routes/testRoutes";
import { fetchAndStoreTopMemes } from "./services/crawlerServices";

cron.schedule("0 * * * *", async () => {
    console.log(`⏳ Fetching memes at ${new Date().toISOString()}`);
    await fetchAndStoreTopMemes();
});

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// Register API routes
app.use("/scrape", scrapeRoutes);
app.use("/api", reportRoutes);
app.use("/test", testRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});