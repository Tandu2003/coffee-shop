const express = require("express");

const ProductController = require("../controllers/product.controller");

const Router = express.Router();

// Router for api/products
Router.route("/").get(ProductController.getProducts);
Router.route("/:id").get(ProductController.getProduct);
Router.route("/").post(ProductController.postProduct);
Router.route("/:id").delete(ProductController.deleteProduct);
Router.route("/:id").put(ProductController.putProduct);

module.exports = Router;
