const express = require('express');
const { createServiceProxy } = require('../proxy/http-proxy');
const authMiddleware = require('../middleware/auth');
const mcache = require('memory-cache');
const { logger } = require('../middleware/logging');

const router = express.Router();

// Cache middleware
const cache = (duration) => {
    return (req, res, next) => {
        // Skip cache for non-GET requests
        if (req.method !== 'GET') return next();

        const key = `__order__${req.originalUrl || req.url}`;
        const cachedBody = mcache.get(key);

        if (cachedBody) {
            logger.debug(`Cache hit: ${key}`);
            return res.send(cachedBody);
        }

        logger.debug(`Cache miss: ${key}`);
        // Override res.send to cache the response
        const originalSend = res.send;
        res.send = function (body) {
            mcache.put(key, body, duration * 1000);
            originalSend.call(this, body);
        };

        next();
    };
};

// Order routes - requires authentication
router.get(
    '/',
    authMiddleware,
    cache(30),
    createServiceProxy('order-service', '/api/orders'),
);
router.get(
    '/:id',
    authMiddleware,
    cache(30),
    createServiceProxy('order-service', '/api/orders'),
);
router.get(
    '/user/:userId',
    authMiddleware,
    cache(30),
    createServiceProxy('order-service', '/api/orders/user'),
);
router.post(
    '/',
    authMiddleware,
    createServiceProxy('order-service', '/api/orders'),
);
router.put(
    '/:id/status',
    authMiddleware,
    createServiceProxy('order-service', '/api/orders'),
);
router.put(
    '/:id/pay',
    authMiddleware,
    createServiceProxy('order-service', '/api/orders'),
);
router.put(
    '/:id/deliver',
    authMiddleware,
    createServiceProxy('order-service', '/api/orders'),
);
router.delete(
    '/:id',
    authMiddleware,
    createServiceProxy('order-service', '/api/orders'),
);

module.exports = router;
