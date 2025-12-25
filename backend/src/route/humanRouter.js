import express from "express";
import humanController from "../controllers/humanController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

let initHumanRouter = (app) => {
  router.post("/api/humans", authMiddleware, humanController.createHuman);
  router.patch("/api/humans/:humanId/status/living", authMiddleware, humanController.setLivingTrue);
  router.patch("/api/humans/:humanId/status/leave", authMiddleware, humanController.setLivingFalse);
  router.get("/api/humans/household/:householdId", authMiddleware, humanController.getAllByHousehold);
  router.get("/api/humans/name/:name", authMiddleware, humanController.getByName);
  router.get("/api/humans/household/:householdId/living", authMiddleware, humanController.getLivingByHousehold);

  return app.use("/", router);
};

export default initHumanRouter;
