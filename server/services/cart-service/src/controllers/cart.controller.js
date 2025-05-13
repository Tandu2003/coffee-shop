const Cart = require("../models/cart.model");

class CartController {
  // [GET] /api/cart/:userId
  async getCart(req, res) {
    try {
      const { userId } = req.params;
      let cart = await Cart.findOne({ userId });
      
      // If cart doesn't exist, create an empty one
      if (!cart) {
        cart = new Cart({ userId, items: [] });
        await cart.save();
      }
      
      res.status(200).json(cart);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // [POST] /api/cart/:userId/item
  async addCartItem(req, res) {
    try {
      const { userId } = req.params;
      const { productId, productType, title, price, quantity, image, options } = req.body;
      
      // Validate required fields
      if (!productId || !productType || !title || !price) {
        return res.status(400).json({ message: "Missing required product information" });
      }

      let cart = await Cart.findOne({ userId });
      
      // If cart doesn't exist, create one
      if (!cart) {
        cart = new Cart({ userId, items: [] });
      }

      // Check if product already in cart (with same options)
      const existingItemIndex = cart.items.findIndex(item => {
        if (item.productId !== productId) return false;
        
        // For coffee, match bagSize and grind
        if (productType === 'coffee' && options) {
          return item.options.bagSize === options.bagSize && 
                 item.options.grind === options.grind;
        }
        
        // For merch, match size and color
        if (productType === 'merch' && options) {
          return item.options.size === options.size && 
                 item.options.color === options.color;
        }
        
        return true;
      });

      // If product exists, update quantity
      if (existingItemIndex > -1) {
        cart.items[existingItemIndex].quantity += quantity || 1;
      } else {
        // Add new item
        cart.items.push({
          productId,
          productType,
          title,
          price,
          quantity: quantity || 1,
          image,
          options
        });
      }
      
      cart.updatedAt = Date.now();
      await cart.save();
      
      res.status(200).json(cart);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // [PUT] /api/cart/:userId/item/:itemId
  async updateCartItem(req, res) {
    try {
      const { userId, itemId } = req.params;
      const { quantity } = req.body;
      
      if (quantity < 1) {
        return res.status(400).json({ message: "Quantity must be at least 1" });
      }
      
      const cart = await Cart.findOne({ userId });
      
      if (!cart) {
        return res.status(404).json({ message: "Cart not found" });
      }
      
      const item = cart.items.id(itemId);
      if (!item) {
        return res.status(404).json({ message: "Item not found in cart" });
      }
      
      item.quantity = quantity;
      cart.updatedAt = Date.now();
      
      await cart.save();
      res.status(200).json(cart);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // [DELETE] /api/cart/:userId/item/:itemId
  async removeCartItem(req, res) {
    try {
      const { userId, itemId } = req.params;
      
      const cart = await Cart.findOne({ userId });
      
      if (!cart) {
        return res.status(404).json({ message: "Cart not found" });
      }
      
      cart.items = cart.items.filter(item => item._id.toString() !== itemId);
      cart.updatedAt = Date.now();
      
      await cart.save();
      res.status(200).json(cart);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // [DELETE] /api/cart/:userId
  async clearCart(req, res) {
    try {
      const { userId } = req.params;
      
      const cart = await Cart.findOne({ userId });
      
      if (!cart) {
        return res.status(404).json({ message: "Cart not found" });
      }
      
      cart.items = [];
      cart.updatedAt = Date.now();
      
      await cart.save();
      res.status(200).json({ message: "Cart cleared" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new CartController();
