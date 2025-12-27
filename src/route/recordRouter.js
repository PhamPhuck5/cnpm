import express from "express";
import recordController from "../controllers/residentRecordController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

let initRecordRouter = (app) => {
  router.post("/api/records", authMiddleware, recordController.handleCreateResidenceRecord); // tạo tạm vắng
  router.post("/api/records/end", authMiddleware, recordController.handleEndResidentRecordHandler);
  router.get("/api/records/household/:householdId", authMiddleware, recordController.getAllRecordsByHousehold);
  router.get("/api/records/household/:householdId/filter", authMiddleware, recordController.getRecordsByHousehold);

  return app.use("/", router);
};

export default initRecordRouter;
