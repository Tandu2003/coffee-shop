const mongoose = require("mongoose");

const merchSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  imageDisplay: { type: String, required: true },
  merchImages: [
    {
      type: String,
      required: true,
    },
  ],
  size: [
    {
      type: String,
      required: true,
    },
  ],
  brand: { type: String, required: true },
  availability: { type: String, required: true },
  newBadge: { type: Boolean, required: true },
  color: [{ type: String, required: true }],
  description: { type: String, required: true },
  features: [
    {
      type: String,
      required: true,
    },
  ],
  review: [
    // {
    //   name: { type: String, required: true },
    //   email: { type: String, required: true },
    //   rating: { type: Number, required: true },
    //   title: { type: String, required: true },
    //   body: { type: String, required: true },
    //   customerImage: { type: String, required: false },
    //   reviewImage: { type: String, required: false },
    //   content: { type: String, required: true },
    //   rate: { type: Number, required: true },
    // },
  ],
  question: [
    // {
    // 	name: { type: String, required: true },
    // 	email: { type: String, required: true },
    // 	question: { type: String, required: true },
    // },
  ],
});

module.exports = mongoose.model("Merch", merchSchema);
