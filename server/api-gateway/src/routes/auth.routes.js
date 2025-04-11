const express = require('express');
const { createServiceProxy } = require('../proxy/http-proxy');
const { createAuthClient } = require('../proxy/grpc-client');
const authMiddleware = require('../middleware/auth');
const { logger } = require('../middleware/logging');

const router = express.Router();

// Public auth routes
router.get('/', authMiddleware.optionalAuth, createServiceProxy('auth'));
router.post('/register', createServiceProxy('auth'));
router.post('/login', createServiceProxy('auth'));

// Protected auth routes
router.post('/logout', authMiddleware.requireAuth, createServiceProxy('auth'));

// Email verification routes
router.get('/user/verify', authMiddleware.optionalAuth, createServiceProxy('auth'));
router.get('/user/verify/:userId/:uniqueString', createServiceProxy('auth'));

// Example gRPC-based auth status route
router.get('/grpc/status', async (req, res, next) => {
  try {
    // Check if we have a session cookie
    if (!req.cookies?.userId) {
      return res.status(200).json({ loggedIn: false });
    }

    const authClient = createAuthClient();
    const response = await authClient.getAuthAsync({ 
      sessionId: req.cookies.userId 
    });
    
    res.json(response);
  } catch (error) {
    logger.error('Error checking auth status via gRPC:', error);
    next(error);
  }
});

module.exports = router;
