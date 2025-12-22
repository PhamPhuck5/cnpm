import db from "../../models/index.js";
import { fn, col } from "sequelize";

import householdServices from "./householdService.js";
import { findBillByID } from "./billService.js";
import { paymentStrategies } from "../../utils/getPaymentValue.js";
import { findHouseholdByUser } from "./householdService.js";

async function createPayment(bill_id, amount, collector, householdId) {
  return await db.Payment.create({
    household_id: householdId,
    bill_id: bill_id,
    date: new Date(),
    amount: amount,
    collector: collector,
  });
}

async function getPaymentForBill(bill_id) {
  const bill = await findBillByID(bill_id);
  const paymentsSummary = await db.Payment.findAll({
    where: { bill_id },
    attributes: ["household_id", [fn("SUM", col("Payment.amount")), "paidAmount"]],
    include: [
      {
        model: db.Household,
        attributes: ["number_car", "number_motobike", "area", "feePerMeter"],
      },
    ],
    group: ["household_id", "Household.id"],
    order: [["household_id", "ASC"]],
    raw: true,
  });
  const result = paymentsSummary.map((row) => {
    const requiredAmount = calculateRequiredAmount(bill, row);
    let remaining = requiredAmount - row.paidAmount;
    if (remaining < 0) remaining = 0;
    return {
      household_id: row.household_id,
      paidAmount: Number(row.paidAmount),
      requiredAmount,
      remaining: remaining,
    };
  });
  return result;
}

async function getPaidStatusByBill(bill_id, userId) {
  const bill = await findBillByID(bill_id, userId);
  const households = await findHouseholdByUser(userId);

  const payments = await db.Payment.findAll({
    where: { bill_id: bill_id },
    attributes: ["household_id", [fn("SUM", col("amount")), "paidAmount"]],
    group: ["household_id"],
    raw: true,
  });

  const paymentMap = new Map(payments.map((p) => [p.household_id, Number(p.paidAmount)]));

  const result = households.map((household) => {
    const requiredAmount = calculateRequiredAmount(bill, household);
    const paidAmount = paymentMap.get(household.id) ?? 0;
    let remaining = requiredAmount - paidAmount;
    if (remaining < 0) remaining = 0;
    return {
      household_id: household.id,
      paidAmount,
      requiredAmount,
      remaining: remaining,
    };
  });

  return result;
}

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

const calculateRequiredAmount = (bill, household) => {
  if (!bill.based) return bill.amount ?? 0;

  const strategy = paymentStrategies[bill.based];
  if (!strategy) return 0;

  return strategy(bill.amount, household);
};

const paymentServices = {
  createPayment: createPayment,
  getPaymentForBill: getPaymentForBill,
  getStatsByBill: getStatsByBill,
  getPaidStatusByBill: getPaidStatusByBill,
};

export default paymentServices;
