require("dotenv").config();
const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    
    // Verify if the requested user ID matches the token's user ID
    // This ensures users can only access their own cart
    if (req.params.userId && req.params.userId !== decoded.userId) {
      return res.status(403).json({ message: "Forbidden: You can only access your own cart" });
    }
    
    next();
  } catch (error) {
    return res.status(403).json({ message: "Forbidden: Invalid token" });
  }
};

module.exports = { authenticateToken };
