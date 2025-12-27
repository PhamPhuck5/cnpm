import roomServices from "../services/baseService/roomService.js"; // Đảm bảo đường dẫn import đúng file service của bạn

const handleGetEmptyRooms = async (req, res) => {
  try {
    const userId = req.user.id;

    const rooms = await roomServices.getEmptyRoomsByUserId(userId);

    return res.status(200).json({
      message: "Get empty rooms success",
      data: rooms,
    });
  } catch (error) {
    console.error("Error in handleGetEmptyRooms:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const handleGetOccupiedRooms = async (req, res) => {
  try {
    const userId = req.user.id;

    const rooms = await roomServices.getOccupiedRoomsByUserId(userId);

    return res.status(200).json({
      message: "Get occupied rooms success",
      data: rooms,
    });
  } catch (error) {
    console.error("Error in handleGetOccupiedRooms:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const handleGetAllRooms = async (req, res) => {
  try {
    const userId = req.user.id;

    const rooms = await roomServices.getAllRoomsByUserId(userId);

    return res.status(200).json({
      message: "Get all rooms success",
      data: rooms,
    });
  } catch (error) {
    console.error("Error in handleGetAllRooms:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export default {
  handleGetEmptyRooms,
  handleGetOccupiedRooms,
  handleGetAllRooms,
};
