import db from "../../models/index.js";
import { fn, col } from "sequelize";

import householdServices from "./householdService.js";
import { findBillByID } from "./billService.js";
import { BILL_BASE, calculateRequiredAmount } from "../../utils/getPaymentValue.js";

async function createPayment(bill_id, amount, collector, householdId) {
  const bill = await findBillByID(bill_id);
  const household = await householdServices.findHouseholdById(householdId);

  return await db.Payment.create({
    household_id: householdId,
    bill_id: bill_id,
    date: new Date(),
    amount: amount,
    require: calculateRequiredAmount(bill, household),
    collector: collector,
  });
} //edited

async function updatePayment(paymentId, payload, userId) {
  const payment = await db.Payment.findByPk(paymentId);
  if (!payment) {
    throw new Error("Payment not found");
  }
  const bill = await findBillByID(payment.bill_id);
  if (bill.based != BILL_BASE.NONE && payload.require) {
    throw new Error("can not update new require for this payment in this bill");
  }
  return await payment.update({
    date: new Date(),
    amount: payload.amount ?? payment.amount,
    require: payload.require ?? payment.require,
    collector: payload.amount ? userId : payment.collector,
  });
}

async function getPaidStatusByBill(bill_id) {
  const bill = await findBillByID(bill_id);
  return await db.Payment.findAll({
    where: { bill_id },
    include: [{ model: db.Household }, { model: db.Bill }],
    raw: true,
  });
}

async function getStatsByBill(bill_id) {
  const payments = await db.Payment.findAll({
    where: { bill_id },
    attributes: [
      [db.sequelize.fn("SUM", db.sequelize.col("amount")), "totalCollected"],
      [db.sequelize.fn("COUNT", db.sequelize.col("id")), "totalPayments"],
      [db.sequelize.fn("SUM", db.sequelize.col("Payment.require")), "totalRequire"],
    ],
    raw: true,
  });
  console.log(payments);
  return payments[0];
}

const paymentServices = {
  createPayment: createPayment,
  updatePayment: updatePayment,
  getStatsByBill: getStatsByBill,
  getPaidStatusByBill: getPaidStatusByBill,
};

export default paymentServices;
