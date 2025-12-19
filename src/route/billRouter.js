import express from "express";
import billController from "../controllers/billController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

let initBillRouter = (app) => {
  router.post("/api/bills", authMiddleware, billController.handleCreateBill);
  router.get("/api/bills/my-apartment", authMiddleware, billController.handleGetAllBillsOfApartment);
  router.get("/api/bills/:id", authMiddleware, billController.handleGetBillById);

  return app.use("/", router);
};

export default initBillRouter;
