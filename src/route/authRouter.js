import express from "express";

import auth from "../controllers/AuthController.js";

let router = express.Router();

let initAuthRouter = (app) => {
  router.post("/login", auth.handleLoggin);
  router.post("/register", auth.handleRegister);
  router.post("/forgot", auth.changePassword);

  return app.use("/api", router);
};

export default initAuthRouter;
