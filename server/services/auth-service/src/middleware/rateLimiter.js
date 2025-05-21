const rateLimit = require('express-rate-limit');

// Login rate limiter: 5 attempts per 15 seconds
const loginLimiter = rateLimit({
  windowMs: 15 * 1000, // 15 seconds
  max: 5, // 5 attempts
  message: {
    message: 'Too many login attempts. Please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    // Use email/username as identifier if available, otherwise use IP
    return req.body.identifier || req.ip;
  },
});

// Register rate limiter: 3 attempts per 60 seconds
const registerLimiter = rateLimit({
  windowMs: 60 * 1000, // 60 seconds
  max: 3, // 3 attempts
  message: {
    message: 'Too many register attempts. Please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    // Use email as identifier if available, otherwise use IP
    return req.body.email || req.ip;
  },
});

module.exports = {
  loginLimiter,
  registerLimiter,
};
