const express = require('express');
const { createServiceProxy } = require('../proxy/http-proxy');
const { createMerchClient } = require('../proxy/grpc-client');
const authMiddleware = require('../middleware/auth');
const mcache = require('memory-cache');
const { logger } = require('../middleware/logging');

const router = express.Router();

// Cache middleware
const cache = (duration) => {
  return (req, res, next) => {
    // Skip cache for non-GET requests
    if (req.method !== 'GET') return next();
    
    const key = `__merch__${req.originalUrl || req.url}`;
    const cachedBody = mcache.get(key);
    
    if (cachedBody) {
      logger.debug(`Cache hit: ${key}`);
      return res.send(cachedBody);
    }
    
    logger.debug(`Cache miss: ${key}`);
    // Override res.send to cache the response
    const originalSend = res.send;
    res.send = function(body) {
      mcache.put(key, body, duration * 1000);
      originalSend.call(this, body);
    };
    
    next();
  };
};

// Public routes - no authentication required
router.get('/', cache(60), createServiceProxy('merch'));
router.get('/:id', cache(120), createServiceProxy('merch'));

// Protected routes - authentication required
router.post('/',
  authMiddleware.requireAuth,
  authMiddleware.requireAdmin,
  createServiceProxy('merch')
);

router.put('/:id',
  authMiddleware.requireAuth,
  authMiddleware.requireAdmin,
  createServiceProxy('merch')
);

router.delete('/:id',
  authMiddleware.requireAuth,
  authMiddleware.requireAdmin,
  createServiceProxy('merch'),
  (req, res) => {
    // Invalidate cache for this merchandise
    mcache.del(`__merch__/api/merch/${req.params.id}`);
    // Invalidate the merchandise list cache
    mcache.del('__merch__/api/merch');
  }
);

// Example gRPC-based route (alternative implementation)
router.get('/grpc/all', async (req, res, next) => {
  try {
    const merchClient = createMerchClient();
    const response = await merchClient.getMerchesAsync({});
    res.json(response.merches);
  } catch (error) {
    next(error);
  }
});

router.get('/grpc/:id', async (req, res, next) => {
  try {
    const merchClient = createMerchClient();
    const response = await merchClient.getMerchAsync({ id: req.params.id });
    res.json(response);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
