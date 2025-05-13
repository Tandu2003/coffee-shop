const jwt = require('jsonwebtoken');

const TOKEN_SECRET = process.env.KEY_SECRET;

const generateToken = (payload) => {
  return jwt.sign(payload, TOKEN_SECRET, { expiresIn: '7d' });
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, TOKEN_SECRET);
  } catch (err) {
    return null;
  }
};

module.exports = {
  generateToken,
  verifyToken,
};
