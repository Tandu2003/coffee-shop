const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema({
  productId: { 
    type: String, 
    required: true 
  },
  productType: { 
    type: String, 
    enum: ['coffee', 'merch'], 
    required: true 
  },
  title: { 
    type: String, 
    required: true 
  },
  price: { 
    type: Number, 
    required: true 
  },
  quantity: { 
    type: Number, 
    required: true, 
    default: 1 
  },
  image: { 
    type: String, 
    required: true 
  },
  options: {
    bagSize: { type: Number },
    grind: { type: String },
    size: { type: String },
    color: { type: String }
  }
});

const cartSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true
  },
  items: [cartItemSchema],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Cart", cartSchema);
