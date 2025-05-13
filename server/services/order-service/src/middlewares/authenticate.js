const { verifyAccessToken } = require('../utils/jwtTokens');

const authenticate = (req, res, next) => {
  const token = req.cookies.accessToken;
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  const decoded = verifyAccessToken(token);
  if (!decoded) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  req.user = decoded;
  next();
};

module.exports = authenticate;
