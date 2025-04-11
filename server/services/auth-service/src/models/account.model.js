const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const SALT_ROUNDS = 12; // Cấu hình số vòng salt

const accountSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    isAdmin: { type: Boolean, default: false },
    verified: { type: Boolean, default: false },
  },
  {
    timestamps: true, // Tự động thêm createdAt, updatedAt
  }
);

/**
 * Tự động mã hóa mật khẩu trước khi lưu vào database
 */
accountSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

/**
 * Hàm so sánh mật khẩu nhập vào với mật khẩu đã lưu
 * @param {string} password - Mật khẩu người dùng nhập vào
 * @returns {Promise<boolean>} - Trả về true nếu mật khẩu đúng, ngược lại false
 */
accountSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("Account", accountSchema);

