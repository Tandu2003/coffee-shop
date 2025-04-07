const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    imageDisplay: { type: String, required: true },
    imageBackground: { type: String, required: true },
    productImages: [{ type: String, required: true }],
    bagSize: [{ type: Number, required: true }],
    grind: [{ type: String, required: true }],
    price: { type: Number, required: true },
    newBadge: { type: Boolean, required: true },
    making: [
      {
        title: { type: String, required: true },
        img: { type: String, required: true },
      },
    ],
    color: {
      colorBackground: { type: String, required: true },
      colorSub: { type: String, required: true },
      colorBorder: { type: String, required: true },
      colorBgRoast: { type: String, required: true },
      colorBorderRoast: { type: String, required: true },
    },
    imageExtra: {
      imgBag: { type: String, required: true },
      imgSub: { type: String, required: true },
    },
    description: { type: String, required: true },
    review: [],
    question: [],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
