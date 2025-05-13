const checkAdmin = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized: No user found' });
    }

    if (req.user.isAdmin) {
      next();
    } else {
      return res
        .status(403)
        .json({ message: 'Forbidden: Admin access required' });
    }
  } catch (error) {
    console.error('Admin check error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = checkAdmin;
