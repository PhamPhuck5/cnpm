import express from "express";
import apartmentController from "../controllers/apartmentController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

let initApartmentRouter = (app) => {
  router.post("/api/apartments", apartmentController.handleCreateApartment);
  router.get("/api/apartments", apartmentController.handleGetAllApartments);

  return app.use("/", router);
};

export default initApartmentRouter;
