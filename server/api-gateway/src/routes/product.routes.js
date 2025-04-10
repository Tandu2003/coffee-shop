const express = require('express');
const { createServiceProxy } = require('../proxy/http-proxy');
const { createProductClient } = require('../proxy/grpc-client');
const authMiddleware = require('../middleware/auth');
const mcache = require('memory-cache');
const { logger } = require('../middleware/logging');

const router = express.Router();

// Cache middleware
const cache = (duration) => {
  return (req, res, next) => {
    // Skip cache for non-GET requests
    if (req.method !== 'GET') return next();
    
    const key = `__product__${req.originalUrl || req.url}`;
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
// With caching for better performance
router.get('/', cache(60), createServiceProxy('product'));
router.get('/:id', cache(120), createServiceProxy('product'));

// Protected routes - authentication required
router.post('/', 
  authMiddleware.requireAuth, 
  authMiddleware.requireAdmin, 
  createServiceProxy('product')
);

router.put('/:id', 
  authMiddleware.requireAuth, 
  authMiddleware.requireAdmin, 
  createServiceProxy('product')
);

router.delete('/:id', 
  authMiddleware.requireAuth, 
  authMiddleware.requireAdmin, 
  createServiceProxy('product'),
  (req, res) => {
    // Invalidate cache for this product
    mcache.del(`__product__/api/products/${req.params.id}`);
    // Invalidate the products list cache
    mcache.del('__product__/api/products');
  }
);

// Example gRPC-based route (alternative implementation)
router.get('/grpc/all', async (req, res, next) => {
  try {
    const productClient = createProductClient();
    const response = await productClient.getProductsAsync({});
    res.json(response.products);
  } catch (error) {
    next(error);
  }
});

router.get('/grpc/:id', async (req, res, next) => {
  try {
    const productClient = createProductClient();
    const response = await productClient.getProductAsync({ id: req.params.id });
    res.json(response);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
