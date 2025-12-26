import householdServices from "../services/baseService/householdService.js";

const handleCreateHousehold = async (req, res) => {
  try {
    //todo: require room exist
    const userId = req.user.id;
    const { room, number_motobike, number_car, start_date, type, feePerMeter } = req.body;

    if (!room) {
      return res.status(400).json({
        message: "Missing required parameters",
      });
    }

    const newHousehold = await householdServices.createHousehold(room, number_motobike, number_car, start_date, userId, type, feePerMeter);

    return res.status(201).json({
      message: "Create household success",
      data: newHousehold,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const handleGetAllHouseholds = async (req, res) => {
  try {
    const userId = req.user.id;

    const households = await householdServices.getAllHouseholds(userId);

    return res.status(200).json({
      message: "Get households success",
      data: households,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
const handleGetAllLivingHouseholds = async (req, res) => {
  try {
    const userId = req.user.id;

    const households = await householdServices.getAllLivingHouseholds(userId);

    return res.status(200).json({
      message: "Get households success",
      data: households,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
const getLivingHouseholdByRoom = async (req, res) => {
  try {
    const userId = req.user.id;
    const { roomName } = req.params;

    const households = await householdServices.getLivingHouseholdByRoom(roomName, userId);

    return res.status(200).json({
      message: "Get households success",
      data: households,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
const handleGetHouseholdsByRoom = async (req, res) => {
  try {
    const userId = req.user.id;
    const { roomName } = req.params;

    const households = await householdServices.getHouseholdsByRoom(roomName, userId);

    return res.status(200).json({
      message: "Get households success",
      data: households,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const handleGetHouseholdDetails = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Missing household ID" });
    }

    const household = await householdServices.getHouseholdDetails(id);

    if (!household) {
      return res.status(404).json({ message: "Household not found" });
    }

    return res.status(200).json({
      message: "Get household details success",
      data: household,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
const handleStopLiving = async (req, res) => {
  try {
    const userId = req.user.id; // Lấy từ authMiddleware
    const { room, stopTime } = req.body;

    if (!room) {
      return res.status(400).json({
        message: "Missing room name",
      });
    }

    await householdServices.onHouseholdStopLiving(room, userId, stopTime);

    return res.status(200).json({
      message: "Household has stopped living successfully",
      leave_date: stopTime || new Date(),
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
export default {
  handleCreateHousehold,
  handleGetAllHouseholds,
  handleGetHouseholdDetails,
  getLivingHouseholdByRoom,
  handleGetAllLivingHouseholds,
  handleGetHouseholdsByRoom,
  handleStopLiving,
};
