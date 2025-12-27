export const BILL_BASE = {
  VOLUNTARY: "voluntary",
  FIXED: "fixed",
  MOTORCYCLE: "motorcycle",
  CAR: "car",
  AREA: "area",
  NONE: "none",
};

export const paymentStrategies = {
  [BILL_BASE.VOLUNTARY]: (amount, household) => 0,

  [BILL_BASE.FIXED]: (amount, household) => amount,

  [BILL_BASE.MOTORCYCLE]: (amount, household) => amount * household.number_motorbike,

  [BILL_BASE.CAR]: (amount, household) => amount * household.number_car,

  [BILL_BASE.AREA]: (amount, household) => household.area * household.feePerMeter,

  [BILL_BASE.NONE]: (amount, household) => null,
};

const calculateRequiredAmount = (bill, household) => {
  if (!bill.based) return bill.amount ?? 0;

  const strategy = paymentStrategies[bill.based];
  if (!strategy) return 0;

  return strategy(bill.amount, household);
};
