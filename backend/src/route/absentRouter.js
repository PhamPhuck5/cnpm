import express from "express";
import absentController from "../controllers/absentController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

let initAbsentRouter = (app) => {
  router.post("/api/absents", authMiddleware, absentController.createAbsent);
  router.get("/api/absents/household/:householdId", authMiddleware, absentController.getAllAbsentsByHousehold);
  router.get("/api/absents/household/:householdId/filter", authMiddleware, absentController.getAbsentsByHousehold);

  return app.use("/", router);
};

export default initAbsentRouter;
