import billServices from "../services/baseService/billService.js";
let handleCreateBill = async (req, res) => {
  try {
    let creatorId = req.user.id;
    let name = req.body.email;
    let last_date = req.body.last_date;
    let based = req.body.based;
    let newBill = await billServices.createNewBill(
      creatorId,
      name,
      last_date,
      based
    );
    return res.status(200).json({
      status: 200,
      message: "create bill success",
      data: {
        name: name,
        last_date: last_date,
      },
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      status: 500,
      message: "Server error",
    });
  }
};
const handleGetAllBillsOfApartment = async (req, res) => {
  try {
    const userId = req.user.id;

    const bills = await billServices.getAllBillsOfApartment(userId);

    return res.status(200).json({
      message: "Lấy danh sách hóa đơn thành công",
      data: bills,
    });
  } catch (error) {
    console.error("Error in handleGetAllBillsOfApartment:", error);
    return res.status(500).json({
      message: "Lỗi máy chủ nội bộ",
      error: error.message,
    });
  }
};

const handleGetBillById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    if (!id) {
      return res.status(400).json({ message: "Thiếu ID hóa đơn" });
    }

    const bill = await billServices.findBillByID(id, userId);

    return res.status(200).json({
      message: "Lấy thông tin hóa đơn thành công",
      data: bill,
    });
  } catch (error) {
    if (error.message === "not permission") {
      return res.status(403).json({
        message: "Bạn không có quyền xem hóa đơn này (không cùng căn hộ)",
      });
    }

    console.error("Error in handleGetBillById:", error);
    return res.status(500).json({
      message: "Lỗi máy chủ nội bộ",
      error: error.message,
    });
  }
};
const billController = {
  handleCreateBill,
  handleGetAllBillsOfApartment,
  handleGetBillById,
};

export default billController;
