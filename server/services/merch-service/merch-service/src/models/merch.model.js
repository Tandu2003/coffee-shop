const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  // name: { type: String, required: true },
  // email: { type: String, required: true },
  // rating: { type: Number, required: true, min: 1, max: 5 },
  // title: { type: String, required: true },
  // body: { type: String, required: true },
  // customerImage: { type: String },
  // reviewImage: { type: String },
  // createdAt: { type: Date, default: Date.now },
});

const questionSchema = new mongoose.Schema({
  // name: { type: String, required: true },
  // email: { type: String, required: true },
  // question: { type: String, required: true },
  // createdAt: { type: Date, default: Date.now },
});

const merchSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  imageDisplay: { type: String, required: true },
  merchImages: [{ type: String, required: true }],
  size: [{ type: String, required: true }],
  brand: { type: String, required: true },
  availability: { type: String, required: true },
  newBadge: { type: Boolean, default: false },
  color: [{ type: String, required: true }],
  description: { type: String, required: true },
  features: [{ type: String, required: true }],
  review: [reviewSchema],
  question: [questionSchema],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Merch", merchSchema);

