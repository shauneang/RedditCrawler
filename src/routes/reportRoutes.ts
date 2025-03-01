import { Router } from "express";
import { generateReport } from "../controllers/reportController";

const router = Router();

router.get("/report", async (req, res) => {
    try {
        const reportBuffer = await generateReport();

        res.setHeader("Content-Disposition", "attachment; filename=report.pdf");
        res.setHeader("Content-Type", "application/pdf");
        res.send(reportBuffer);
    } catch (error) {
        console.error("❌ Error generating report:", error);
        res.status(500).json({ error: "Failed to generate report" });
    }
});

export default router;