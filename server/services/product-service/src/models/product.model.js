const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    imageDisplay: { type: String, required: true },
    imageBackground: { type: String, required: true },
    productImages: [
      {
        type: String,
        required: true,
      },
    ],
    bagSize: [
      {
        type: Number,
        required: true,
      },
    ],
    grind: [
      {
        type: String,
        required: true,
      },
    ],
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
    discription: [
      {
        type: String,
        required: true,
      },
    ],
    discription: { type: String, required: true },
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
      //   name: { type: String, required: true },
      //   email: { type: String, required: true },
      //   question: { type: String, required: true },
      // },
    ],
  },
  { timestamps: true },
);

module.exports = mongoose.model("Product", productSchema);
