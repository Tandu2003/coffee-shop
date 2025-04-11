const bcrypt = require("bcryptjs");

// Cấu hình số vòng salt
const SALT_ROUNDS = 12;

/**
 * Băm mật khẩu với bcrypt
 * @param {string} password - Mật khẩu gốc
 * @returns {Promise<string>} - Mật khẩu đã được băm
 */
const hashPassword = async (password) => {
  try {
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    return await bcrypt.hash(password, salt);
  } catch (error) {
    throw new Error("Lỗi khi mã hóa mật khẩu: " + error.message);
  }
};

/**
 * So sánh mật khẩu với hash đã lưu
 * @param {string} password - Mật khẩu gốc
 * @param {string} hashedPassword - Mật khẩu đã được băm
 * @returns {Promise<boolean>} - Trả về true nếu trùng khớp, false nếu không
 */
const comparePassword = async (password, hashedPassword) => {
  try {
    return await bcrypt.compare(password, hashedPassword);
  } catch (error) {
    throw new Error("Lỗi khi so sánh mật khẩu: " + error.message);
  }
};

module.exports = { hashPassword, comparePassword };

