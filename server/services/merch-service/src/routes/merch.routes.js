const express = require("express");

const MerchController = require("../controllers/merch.controller");

const Router = express.Router();

// Router for api/merch
Router.route("/").get(MerchController.getMerches);
Router.route("/:id").get(MerchController.getMerch);
Router.route("/").post(MerchController.postMerch);
Router.route("/:id").delete(MerchController.deleteMerch);
Router.route("/:id").put(MerchController.putMerch);

module.exports = Router;
