import billServices from "../services/baseService/billService.js";
import paymentServices from "../services/baseService/paymentService.js";
let handleCreateBill = async (req, res) => {
  try {
    let household_id = req.user.household_id;
    let bill_id = req.body.bill_id;
    let amount = req.body.amount;
    let collector = req.user.id;
    let newPayment = await paymentServices.createPayment(
      household_id,
      bill_id,
      amount,
      collector
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

let handleGetAllPaymentByBill = async () => {
  try {
    if (billServices.checkPermission(req.body.billId, req.user.id)) {
      return res.status(403).json({
        status: 403,
        message: "you don't have permission to access this content",
      });
    }
    let listPayment = await paymentServices.getAllPaymentByBill(
      req.body.billId
    );
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
