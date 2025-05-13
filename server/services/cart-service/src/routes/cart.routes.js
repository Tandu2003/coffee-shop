const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cart.controller');
const authenticate = require('../middleware/authenticate');

// Apply authentication middleware to all routes
router.use(authenticate);

// Get cart
router.get('/', cartController.getCart);

// Add item to cart
router.post('/', cartController.addToCart);

// Update cart item quantity
router.put('/:itemId', cartController.updateCartItem);

// Remove item from cart
router.delete('/:itemId', cartController.removeCartItem);

// Clear cart
router.delete('/', cartController.clearCart);

module.exports = router;
