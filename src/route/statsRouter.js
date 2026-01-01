import express from "express";
import statsController from "../controllers/statsController.js"; 
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

const initStatsRouter = (app) => {
    router.get("/api/stats/overview", authMiddleware, statsController.getDashboardData);
    router.get("/api/stats/revenue", authMiddleware, statsController.getRevenueChart);
    return app.use("/", router);
};

export default initStatsRouter;