const express = require("express");
const AuthController = require("../controllers/auth.controller");
const VerifyController = require("../controllers/verify.controller");
const { authenticateToken } = require("../middleware/auth.middleware"); // Middleware xác thực

const Router = express.Router();

/**
 * @route   GET /api/auth
 * @desc    Lấy thông tin xác thực (có thể yêu cầu token nếu cần)
 */
Router.get("/", authenticateToken, AuthController.getAuth);

/**
 * @route   POST /api/auth/register
 * @desc    Đăng ký tài khoản mới
 */
Router.post("/register", AuthController.postRegister);

/**
 * @route   POST /api/auth/login
 * @desc    Đăng nhập tài khoản
 */
Router.post("/login", AuthController.postLogin);

/**
 * @route   POST /api/auth/logout
 * @desc    Đăng xuất
 */
Router.post("/logout", authenticateToken, AuthController.postLogout);

/**
 * @route   GET /api/auth/user/verify
 * @desc    Gửi email xác minh tài khoản
 */
Router.get("/user/verify", VerifyController.getVerify);

/**
 * @route   GET /api/auth/user/verify/:userId/:uniqueString
 * @desc    Xác minh tài khoản qua email
 */
Router.get("/user/verify/:userId/:uniqueString", VerifyController.getVerifyUser);

module.exports = Router;

