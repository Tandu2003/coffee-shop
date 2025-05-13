const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    image: { type: String, required: true },
    price: { type: Number, required: true },
    productId: { type: String, required: true },
    productType: {
      type: String,
      required: true,
      enum: ['coffee', 'merch'],
    },
    options: {
      // For coffee products
      bagSize: { type: Number },
      grind: { type: String },

      // For merch products
      size: { type: String },
      color: { type: String },
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model('OrderItem', orderItemSchema);
