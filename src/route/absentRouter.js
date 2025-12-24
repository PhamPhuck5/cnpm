import express from "express";
import absentController from "../controllers/absentController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

let initAbsentRouter = (app) => {
  router.post("/api/absents", authMiddleware, absentController.createAbsent);
  router.post("/api/absents/end", authMiddleware, absentController.endAbsentHandler); //     const { humanId, start_date, last_date } = req.body;
  router.get("/api/absents/household/:householdId", authMiddleware, absentController.getAllAbsentsByHousehold);
  router.get("/api/absents/household/:householdId/filter", authMiddleware, absentController.getAbsentsByHousehold);

  return app.use("/", router);
};

export default initAbsentRouter;
