import db from "../models/index.js";

async function createPayment(household_id, bill_id, amount, collector) {
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
const paymentServices = {
  createPayment: createPayment,
  getAllPaymentByBill: getAllPaymentByBill,
};
export default paymentServices;
