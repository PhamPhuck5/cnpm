import express from "express";
import roomController from "../controllers/roomController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

let initRoomRouter = (app) => {
  /**
   * @route GET /api/room/all
   * @desc Lấy tất cả các phòng thuộc căn hộ của user
   * @access Private (Cần token)
   */
  router.get("/all", authMiddleware, roomController.handleGetAllRooms);

  /**
   * @route GET /api/room/empty
   * @desc Lấy danh sách các phòng còn trống
   * @access Private
   */
  router.get("/empty", authMiddleware, roomController.handleGetEmptyRooms);

  /**
   * @route GET /api/room/occupied
   * @desc Lấy danh sách các phòng đang có hộ gia đình ở
   * @access Private
   */
  router.get("/occupied", authMiddleware, roomController.handleGetOccupiedRooms);

  return app.use("/api/rooms", router);
};
export default initRoomRouter;
