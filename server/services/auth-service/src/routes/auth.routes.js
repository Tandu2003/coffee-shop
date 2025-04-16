const express = require("express");

const AuthController = require("../controllers/auth.controller");
const VerifyController = require("../controllers/verify.controller");

const Router = express.Router();

// Routes for /api/auth
Router.route("/").get(AuthController.getAuth);
Router.route("/register").post(AuthController.postRegister);
Router.route("/login").post(AuthController.postLogin);
Router.route("/logout").post(AuthController.postLogout);

// Routes for /user/verify
Router.route("/user/verify").get(VerifyController.getVerify);
Router.route("/user/verify/:userId/:uniqueString").get(VerifyController.getVerifyUser);

module.exports = Router;
