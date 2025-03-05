const jwt = require("jsonwebtoken");

// Secret key để xác thực JWT (Lưu ý: Nên đặt trong biến môi trường .env)
const SECRET_KEY = process.env.JWT_SECRET || "your_secret_key";

/**
 * Middleware xác thực token từ request header
 */
const authenticateToken = (req, res, next) => {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  jwt.verify(token.split(" ")[1], SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Forbidden: Invalid token" });
    }
    req.user = user; // Lưu user vào request để các API sau có thể dùng
    next();
  });
};

module.exports = { authenticateToken };
