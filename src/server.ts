import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import redditRouter from "./routes/redditRouter";
dotenv.config();
const app = express();
const port = process.env.PORT || 5001;

app.use(express.json());
app.use(cors());

// Register the scraping router
app.use("/scrape", redditRouter);

app.listen(port, () => console.log(`Server running on port ${port}`));