const express = require("express");
const CartController = require("../controllers/cart.controller");
const { authenticateToken } = require("../middleware/auth.middleware");

const Router = express.Router();

// Get cart for a user
Router.get("/:userId", authenticateToken, CartController.getCart);

// Add item to cart
Router.post("/:userId/item", authenticateToken, CartController.addCartItem);

// Update item quantity
Router.put("/:userId/item/:itemId", authenticateToken, CartController.updateCartItem);

// Remove item from cart
Router.delete("/:userId/item/:itemId", authenticateToken, CartController.removeCartItem);

// Clear entire cart
Router.delete("/:userId", authenticateToken, CartController.clearCart);

module.exports = Router;
