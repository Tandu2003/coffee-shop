const jwt = require("jsonwebtoken");

// Secret key để xác thực JWT (Lưu ý: Nên đặt trong biến môi trường .env)
const SECRET_KEY = process.env.JWT_SECRET || "your_secret_key";

/**
 * Middleware xác thực token từ request header
 */
const authenticateToken = (req, res, next) => {
  if (!req.session.user?.isAdmin) {
    return res.status(401).send({ message: "Authorization header required", status: 401 });
  }

  next();
};

module.exports = { authenticateToken };
