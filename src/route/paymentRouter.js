import express from "express";
import paymentController from "../controllers/paymentController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

let initPaymentRouter = (app) => {
  router.post("/api/payments", authMiddleware, paymentController.handleCreatePayment);
  router.get("/api/payments/bill-list/:billId", authMiddleware, paymentController.handleGetAllPaymentByBill);
  router.get("/api/payments/stats/:billId", authMiddleware, paymentController.handleGetStatsByBill);
  router.put("/api/payments/update/:id", authMiddleware, paymentController.handleUpdatePayment);
  return app.use("/", router);
};

export default initPaymentRouter;
