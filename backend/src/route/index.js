import initAuthRouter from "./authRouter.js";
import initApartmentRouter from "./apartmentRouter.js";
import initHouseholdRouter from "./householdRouter.js";
import initHumanRouter from "./humanRouter.js";
import initBillRouter from "./billRouter.js";
import initPaymentRouter from "./paymentRouter.js";
import initRecordRouter from "./recordRouter.js";
import initRoomRouter from "./roomRouter.js";
import initStatsRouter from "./statsRouter.js";
let initAppRouter = (app) => {
  initAuthRouter(app);
  initApartmentRouter(app);
  initHouseholdRouter(app);
  initHumanRouter(app);
  initBillRouter(app);
  initPaymentRouter(app);
  initRecordRouter(app);
  initRoomRouter(app);
  initStatsRouter(app);
};

export default initAppRouter;