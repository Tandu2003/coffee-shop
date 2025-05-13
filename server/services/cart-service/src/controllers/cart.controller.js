const Cart = require('../models/cart.model');

// Get cart by user ID
const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      return res.status(200).json({ items: [], totalPrice: 0 });
    }
    res.status(200).json(cart);
  } catch (error) {
    console.error('Error in getCart:', error);
    res
      .status(500)
      .json({ message: 'Failed to get cart', error: error.message });
  }
};

// Add item to cart
const addToCart = async (req, res) => {
  try {
    const {
      productId,
      productType,
      name,
      image,
      price,
      quantity,
      options = {},
    } = req.body;

    // Validate required fields
    if (!productId || !productType || !name || !image || !price || !quantity) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Validate product type
    if (!['coffee', 'merch'].includes(productType)) {
      return res.status(400).json({ message: 'Invalid product type' });
    }

    let cart = await Cart.findOne({ userId: req.user._id });

    if (!cart) {
      // Create new cart if doesn't exist
      cart = new Cart({
        userId: req.user._id,
        items: [
          {
            productId,
            productType,
            name,
            image,
            price,
            quantity,
            options,
          },
        ],
      });
    } else {
      // Check if item already exists with same options
      const existingItemIndex = cart.items.findIndex(
        (item) =>
          item.productId.toString() === productId &&
          JSON.stringify(item.options) === JSON.stringify(options),
      );

      if (existingItemIndex > -1) {
        // Update quantity if item exists
        cart.items[existingItemIndex].quantity += quantity;
      } else {
        // Add new item
        cart.items.push({
          productId,
          productType,
          name,
          image,
          price,
          quantity,
          options,
        });
      }
    }

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    console.error('Error in addToCart:', error);
    res
      .status(500)
      .json({ message: 'Failed to add item to cart', error: error.message });
  }
};

// Update cart item quantity
const updateCartItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({ message: 'Invalid quantity' });
    }

    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item._id.toString() === itemId,
    );
    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    cart.items[itemIndex].quantity = quantity;
    await cart.save();

    res.status(200).json(cart);
  } catch (error) {
    console.error('Error in updateCartItem:', error);
    res
      .status(500)
      .json({ message: 'Failed to update cart item', error: error.message });
  }
};

// Remove item from cart
const removeCartItem = async (req, res) => {
  try {
    const { itemId } = req.params;

    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items = cart.items.filter((item) => item._id.toString() !== itemId);
    await cart.save();

    res.status(200).json(cart);
  } catch (error) {
    console.error('Error in removeCartItem:', error);
    res.status(500).json({
      message: 'Failed to remove item from cart',
      error: error.message,
    });
  }
};

// Clear cart
const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items = [];
    await cart.save();

    res.status(200).json(cart);
  } catch (error) {
    console.error('Error in clearCart:', error);
    res
      .status(500)
      .json({ message: 'Failed to clear cart', error: error.message });
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
};
