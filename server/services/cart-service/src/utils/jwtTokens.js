const jwt = require('jsonwebtoken');

const TOKEN_SECRET = process.env.KEY_SECRET;

const verifyToken = (token) => {
  try {
    return jwt.verify(token, TOKEN_SECRET);
  } catch (err) {
    console.log('err', err);
    return null;
  }
};

module.exports = {
  verifyToken,
};
