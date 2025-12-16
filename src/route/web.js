import express from "express";

import passport from "../config/oAuthFacebook.js";

import auth from "../controllers/AuthController.js";
import authControler from "../controllers/AuthController.js";
let router = express.Router();

let initWebRouter = (app) => {
  router.get(
    "/facebook/auth",
    passport.authenticate("facebook", { scope: [""] })
  );
  router.get(
    "/facebook/callback",
    passport.authenticate("facebook", {
      session: false,
      failureRedirect: "/login",
    }),
    authControler.handleFacebookLoggin
  );

  router.post("/api/login", auth.handleLoggin);
  router.post("/api/register", auth.handleRegister);
  router.post("/api/forgot", auth.changePassword);

  return app.use("/", router);
};

export default initWebRouter;
