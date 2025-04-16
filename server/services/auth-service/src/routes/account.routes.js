const express = require("express");
const AccountController = require("../controllers/account.controller");
const { authenticateToken } = require("../middleware/auth.middleware");

const Router = express.Router();

Router.get("/", authenticateToken, AccountController.getAll);
Router.post("/:email", authenticateToken, AccountController.put);

module.exports = Router;
