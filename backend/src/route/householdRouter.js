import express from "express";
import householdController from "../controllers/householdController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

let initHouseholdRouter = (app) => {
  router.post("/api/households/create", authMiddleware, householdController.handleCreateHousehold);
  router.get("/api/households", authMiddleware, householdController.handleGetAllHouseholds);
  router.get("/api/households/:id", authMiddleware, householdController.handleGetHouseholdDetails);

  return app.use("/", router);
};

export default initHouseholdRouter;
