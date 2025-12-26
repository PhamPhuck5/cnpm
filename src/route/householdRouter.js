import express from "express";
import householdController from "../controllers/householdController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

let initHouseholdRouter = (app) => {
  router.post("/api/households/create", authMiddleware, householdController.handleCreateHousehold);
  router.get("/api/households", authMiddleware, householdController.handleGetAllHouseholds);
  router.get("/api/households/living", authMiddleware, householdController.handleGetAllLivingHouseholds);
  router.get("/api/household/roomname/living/:name", authMiddleware, householdController.getLivingHouseholdByRoom);
  router.get("/api/household/roomname/:name", authMiddleware, householdController.handleGetHouseholdsByRoom);
  router.get("/api/households/:id", authMiddleware, householdController.handleGetHouseholdDetails);
  router.put("/api/households/stop-living", authMiddleware, householdController.handleStopLiving);

  return app.use("/", router);
};

export default initHouseholdRouter;
