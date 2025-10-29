import db from "../models/index.js";

async function createPayment(household_id, bill_id, amount, collector) {
  const newHousehold = await db.Household.create({
    household_id: household_id,
    bill_id: bill_id,
    date: new Date(),
    amount: amount,
    collector: collector,
  });

  return newHousehold;
}
async function getAllPaymentByBill(bill_id) {
  const movies = await db.Payment.findAll({
    where: { bill_id: bill_id },
  });
  return movies;
}
const paymentServices = {
  createPayment: createPayment,
  getAllPaymentByBill: getAllPaymentByBill,
};
export default paymentServices;
