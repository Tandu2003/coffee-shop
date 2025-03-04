const mongoose = require("mongoose");

const verification = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    uniqueString: { type: String, required: true },
    expiresAt: { type: Date, required: true },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Verification", verification);
