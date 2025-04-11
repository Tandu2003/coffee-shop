const jwt = require('jsonwebtoken');
const config = require('../config');
const grpcClient = require('../proxy/grpc-client');
const { logger } = require('./logging');

// Middleware to validate session
const requireAuth = async (req, res, next) => {
  try {
    // 1. Check for session cookie
    if (req.cookies && req.cookies.userId) {
      try {
        // Use the auth service to validate the session
        const authClient = grpcClient.createAuthClient();
        const response = await authClient.verifyAsync({ sessionId: req.cookies.userId });
        
        if (response.loggedIn) {
          // Add user data to request
          req.session = { user: response.user };
          return next();
        }
      } catch (error) {
        logger.error('Session validation error:', error);
      }
    }
    
    // 2. Check for JWT in Authorization header as fallback
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      try {
        const decoded = jwt.verify(token, config.security.jwtSecret);
        req.user = decoded;
        return next();
      } catch (error) {
        logger.error('JWT validation error:', error);
      }
    }
    
    // No valid authentication found
    throw { status: 401, name: 'UnauthorizedError', message: 'Authentication required' };
  } catch (error) {
    next(error);
  }
};

// Optional auth middleware - doesn't fail if not authenticated
const optionalAuth = async (req, res, next) => {
  try {
    // 1. Check for session cookie
    if (req.cookies && req.cookies.userId) {
      try {
        const authClient = grpcClient.createAuthClient();
        const response = await authClient.verifyAsync({ sessionId: req.cookies.userId });
        
        if (response.loggedIn) {
          req.session = { user: response.user };
        }
      } catch (error) {
        logger.warn('Optional session validation error:', error);
      }
    }
    
    // 2. Check for JWT in Authorization header as fallback
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      try {
        const decoded = jwt.verify(token, config.security.jwtSecret);
        req.user = decoded;
      } catch (error) {
        logger.warn('Optional JWT validation error:', error);
      }
    }
    
    next();
  } catch (error) {
    next(error);
  }
};

// Check if user is admin
const requireAdmin = (req, res, next) => {
  try {
    const user = req.session?.user || req.user;
    
    if (!user || !user.isAdmin) {
      throw { status: 403, name: 'ForbiddenError', message: 'Admin access required' };
    }
    
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  requireAuth,
  optionalAuth,
  requireAdmin
};
