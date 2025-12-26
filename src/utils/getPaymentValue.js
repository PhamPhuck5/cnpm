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

  [BILL_BASE.MOTORCYCLE]: (amount, household) => amount * household.number_motobike,

  [BILL_BASE.CAR]: (amount, household) => amount * household.number_car,

  [BILL_BASE.AREA]: (amount, household) => household.area * household.feePerMeter,

  [BILL_BASE.NONE]: (amount, household) => null,
};
