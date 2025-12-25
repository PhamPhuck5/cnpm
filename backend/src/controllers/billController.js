import billServices from "../services/baseService/billService.js";
import db from "../models/index.js"; // Cần import db để tìm household

// API tạo hóa đơn lẻ (Custom Bill)
let handleCreateBill = async (req, res) => {
  try {
    // Logic mới: Cần tìm householdId dựa trên user đang login
    let userId = req.user.id;
    let { name, amount, description } = req.body; // Lấy các trường mới

    // Tìm hộ khẩu của user này
    const user = await db.User.findByPk(userId);
    const household = await db.Household.findOne({
        where: { apartment_id: user.apartment_id }
    });

    if (!household) {
        return res.status(400).json({ status: 400, message: "User chưa thuộc hộ khẩu nào" });
    }

    let newBill = await billServices.createNewBill(
      household.id, // Truyền householdId
      name,
      amount,
      description
    );

    return res.status(200).json({
      status: 200,
      message: "Tạo hóa đơn thành công",
      data: newBill,
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      status: 500,
      message: "Server error",
    });
  }
};

// API lấy bill của user (Giữ nguyên logic gọi service)
const handleGetAllBillsOfApartment = async (req, res) => {
  try {
    const userId = req.user.id;
    const bills = await billServices.getAllBillsOfApartment(userId);

    return res.status(200).json({
      message: "Lấy danh sách hóa đơn thành công",
      data: bills,
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({
      message: "Lỗi máy chủ nội bộ",
      error: error.message,
    });
  }
};

// API lấy chi tiết bill (Cập nhật logic check quyền)
const handleGetBillById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    if (!id) return res.status(400).json({ message: "Thiếu ID hóa đơn" });

    // Kiểm tra quyền trước
    const hasPermission = await billServices.checkPermission(id, userId);
    if (!hasPermission) {
         return res.status(403).json({
            message: "Bạn không có quyền xem hóa đơn này (không cùng căn hộ)",
         });
    }

    const bill = await billServices.findBillByID(id);

    return res.status(200).json({
      message: "Lấy thông tin hóa đơn thành công",
      data: bill,
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({
      message: "Lỗi máy chủ nội bộ",
      error: error.message,
    });
  }
};

// API Admin tạo bill hàng loạt (Thêm cái này vào controller)
const handleGenerateBills = async (req, res) => {
    try {
        const { month, year } = req.body;
        const bills = await billServices.generateMonthlyBills(month, year);
        return res.status(200).json({
            message: "Tạo hóa đơn tháng thành công",
            data: bills
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

// API Admin xem tất cả bill (Thêm cái này)
const handleGetAllBills = async (req, res) => {
    try {
        const { status } = req.query;
        const bills = await billServices.getAllBills(status);
        return res.status(200).json({ data: bills });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const billController = {
  handleCreateBill,
  handleGetAllBillsOfApartment,
  handleGetBillById,
  handleGenerateBills, 
  handleGetAllBills    
};

export default billController;