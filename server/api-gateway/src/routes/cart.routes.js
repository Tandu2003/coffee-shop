const express = require('express');
const { createServiceProxy } = require('../proxy/http-proxy');
const authMiddleware = require('../middleware/auth');
const mcache = require('memory-cache');
const { logger } = require('../middleware/logging');

const router = express.Router();

// Cache middleware for GET requests only
const cache = (duration) => {
  return (req, res, next) => {
    // Skip cache for non-GET requests
    if (req.method !== 'GET') return next();
    
    const key = `__cart__${req.originalUrl || req.url}`;
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

// Protected routes - authentication required
router.get('/:userId', 
  authMiddleware.requireAuth,
  cache(30), // Short cache time for cart items
  createServiceProxy('cart')
);

router.post('/:userId/item',
  authMiddleware.requireAuth,
  createServiceProxy('cart'),
  (req, res) => {
    // Invalidate cache when modifying cart
    mcache.del(`__cart__/api/cart/${req.params.userId}`);
  }
);

router.put('/:userId/item/:itemId',
  authMiddleware.requireAuth,
  createServiceProxy('cart'),
  (req, res) => {
    // Invalidate cache when modifying cart
    mcache.del(`__cart__/api/cart/${req.params.userId}`);
  }
);

router.delete('/:userId/item/:itemId',
  authMiddleware.requireAuth,
  createServiceProxy('cart'),
  (req, res) => {
    // Invalidate cache when modifying cart
    mcache.del(`__cart__/api/cart/${req.params.userId}`);
  }
);

router.delete('/:userId',
  authMiddleware.requireAuth,
  createServiceProxy('cart'),
  (req, res) => {
    // Invalidate cache when clearing cart
    mcache.del(`__cart__/api/cart/${req.params.userId}`);
  }
);

module.exports = router;
