import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import "./bot/topMemesBot";
import scrapeRoutes from "./routes/redditRouter";
import reportRoutes from "./routes/reportRoutes";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// Register API routes
app.use("/scrape", scrapeRoutes);

// Register API routes
app.use("/api", reportRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});