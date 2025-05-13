const { verifyToken } = require('../utils/jwtTokens');

const checkAdmin = (req, res, next) => {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const user = verifyToken(token);

  if (!user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (user.isAdmin) {
    next();
  } else {
    return res.status(403).json({ message: 'Forbidden' });
  }
};

module.exports = checkAdmin;
