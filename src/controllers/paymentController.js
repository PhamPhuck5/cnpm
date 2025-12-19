import payment from "../models/payment.js";
import billServices from "../services/baseService/billService.js";
import paymentServices from "../services/baseService/paymentService.js";
let handleCreatePayment = async (req, res) => {
  try {
    let bill_id = req.body.bill_id;
    let amount = req.body.amount;
    let collector = req.user.id;
    let newPayment = await paymentServices.createPayment(bill_id, amount, collector);
    return res.status(200).json({
      status: 200,
      message: "create payment success",
      data: payment,
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      status: 500,
      message: "Server error",
    });
  }
};

let handleGetAllPaymentByBill = async (req, res) => {
  try {
    const { billId } = req.params;

    if (!(await billServices.checkPermission(billId, req.user.id))) {
      return res.status(403).json({
        status: 403,
        message: "you don't have permission to access this content",
      });
    }
    let listPayment = await paymentServices.getAllPaymentByBill(billId);
    return res.status(200).json({
      status: 200,
      message: "create bill success",
      data: listPayment,
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      status: 500,
      message: "Server error",
    });
  }
};

const handleGetStatsByBill = async (req, res) => {
  try {
    const { billId } = req.params;

    if (!billId) {
      return res.status(400).json({
        message: "Thiếu mã hóa đơn (billId) để lấy thống kê",
      });
    }

    const stats = await paymentServices.getStatsByBill(billId);

    const responseData = {
      totalCollected: stats.totalCollected || 0,
      totalPayments: stats.totalPayments || 0,
    };

    return res.status(200).json({
      message: "Lấy thống kê thanh toán thành công",
      data: responseData,
    });
  } catch (error) {
    console.error("Error in handleGetStatsByBill:", error);
    return res.status(500).json({
      message: "Lỗi máy chủ nội bộ khi lấy thống kê",
      error: error.message,
    });
  }
};

const paymentController = {
  handleCreatePayment,
  handleGetAllPaymentByBill,
  handleGetStatsByBill,
};

export default paymentController;
