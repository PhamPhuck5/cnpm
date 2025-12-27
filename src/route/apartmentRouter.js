import express from "express";
import apartmentController from "../controllers/apartmentController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

let initApartmentRouter = (app) => {
  router.post("/api/apartments", apartmentController.handleCreateApartment); // cái này cx không dùng nốt sau t add admin right vào thôi
  router.get("/api/apartments", authMiddleware, apartmentController.handleGetAllApartments); // cái này cho có thôi m không dùng làm gì đâu
  router.get("/api/apartment", authMiddleware, apartmentController.handleGetApartmentByUser); // cái này lấy dc các thông tin chung của chung cư

  return app.use("/", router);
};

export default initApartmentRouter;
