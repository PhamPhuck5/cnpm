import db from "../../models/index.js";
import householdServices from "./householdService.js";
async function createPayment(bill_id, amount, collector) {
  const household_id = await householdServices.findHouseholdByUser(collector);

  return await db.Payment.create({
    household_id: household_id,
    bill_id: bill_id,
    date: new Date(),
    amount: amount,
    collector: collector,
  });
}
async function getAllPaymentByBill(bill_id) {
  return await db.Payment.findAll({
    where: { bill_id: bill_id },
  });
}
//bảng thống kê
async function getStatsByBill(bill_id) {
  const payments = await db.Payment.findAll({
    where: { bill_id },
    attributes: [
      [db.sequelize.fn("SUM", db.sequelize.col("amount")), "totalCollected"],
      [db.sequelize.fn("COUNT", db.sequelize.col("id")), "totalPayments"],
    ],
    raw: true,
  });
  return payments[0];
}
const paymentServices = {
  createPayment: createPayment,
  getAllPaymentByBill: getAllPaymentByBill,
  getStatsByBill: getStatsByBill,
};

export default paymentServices;
