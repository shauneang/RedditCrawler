"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const node_cron_1 = __importDefault(require("node-cron"));
require("./src/bot/topMemesBot");
const crawlerRoutes_1 = __importDefault(require("./src/routes/crawlerRoutes"));
const reportRoutes_1 = __importDefault(require("./src/routes/reportRoutes"));
const testRoutes_1 = __importDefault(require("./src/routes/testRoutes"));
const crawlerServices_1 = require("./src/services/crawlerServices");
require("./src/utils/credentials");
const credentials_1 = require("./src/utils/credentials");
node_cron_1.default.schedule("0 * * * *", () => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`⏳ Fetching memes at ${new Date().toISOString()}`);
    yield (0, crawlerServices_1.fetchAndStoreTopMemes)();
}));
dotenv_1.default.config();
(0, credentials_1.createTempGoogleCredentials)();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
// Register API routes
app.use("/scrape", crawlerRoutes_1.default);
app.use("/api", reportRoutes_1.default);
app.use("/test", testRoutes_1.default);
app.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () { res.status(200).json({ message: "Hello World." }); }));
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
