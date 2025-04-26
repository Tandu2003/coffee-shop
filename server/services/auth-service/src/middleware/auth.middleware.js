const { verifyToken } = require("../config/jwt");

/**
 * Middleware xác thực token từ request header
 */
const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).send({ message: "Authorization header required", status: 401 });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(401).send({ message: "Invalid token", status: 401 });
  }

  if (!decoded.isAdmin) {
    return res.status(403).send({ message: "Admin access required", status: 403 });
  }

  req.user = decoded;
  next();
};

module.exports = { authenticateToken };
