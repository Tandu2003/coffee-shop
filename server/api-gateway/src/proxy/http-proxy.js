const { createProxyMiddleware } = require('http-proxy-middleware');
const config = require('../config');
const { logger } = require('../middleware/logging');
const CircuitBreaker = require('opossum');

// Circuit breaker options
const circuitOptions = {
  timeout: 5000, // 5 seconds
  errorThresholdPercentage: 50, // Open circuit if 50% of requests fail
  resetTimeout: 30000 // After 30 seconds, try again
};

// Cache for circuit breakers
const circuitBreakers = new Map();

// Get or create circuit breaker for a service
const getCircuitBreaker = (serviceName) => {
  if (circuitBreakers.has(serviceName)) {
    return circuitBreakers.get(serviceName);
  }
  
  const serviceUrl = config.services[serviceName].restUrl;
  const circuit = new CircuitBreaker((options) => {
    return new Promise((resolve, reject) => {
      // This is a placeholder for the proxy request
      // The actual request happens in the middleware
      resolve();
    });
  }, circuitOptions);
  
  // Add listeners
  circuit.on('open', () => logger.warn(`Circuit for ${serviceName} is now open`));
  circuit.on('close', () => logger.info(`Circuit for ${serviceName} is now closed`));
  circuit.on('halfOpen', () => logger.info(`Circuit for ${serviceName} is now half open`));
  
  circuitBreakers.set(serviceName, circuit);
  return circuit;
};

// Create proxy middleware for a service with circuit breaker
const createServiceProxy = (serviceName, options = {}) => {
  const serviceUrl = config.services[serviceName].restUrl;
  const circuit = getCircuitBreaker(serviceName);
  
  // Create the proxy middleware
  const proxy = createProxyMiddleware({
    target: serviceUrl,
    changeOrigin: true,
    pathRewrite: options.pathRewrite || undefined,
    onProxyReq: (proxyReq, req, res) => {
      // Add useful headers
      if (req.session && req.session.user) {
        proxyReq.setHeader('X-User-ID', req.session.user._id);
        proxyReq.setHeader('X-User-Role', req.session.user.isAdmin ? 'admin' : 'user');
      } else if (req.user) {
        proxyReq.setHeader('X-User-ID', req.user.sub || req.user._id);
        proxyReq.setHeader('X-User-Role', req.user.isAdmin ? 'admin' : 'user');
      }
      
      // Log the proxy request
      logger.debug(`[Proxy] ${req.method} ${req.path} -> ${serviceUrl}`);
    },
    onProxyRes: (proxyRes, req, res) => {
      // Circuit breaker integration - successful request
      circuit.close();
    },
    onError: (err, req, res) => {
      // Circuit breaker integration - failed request
      circuit.fire().catch(() => {
        // Circuit is open, handle fallback
        logger.error(`Service ${serviceName} unavailable:`, err);
        res.status(503).json({
          error: 'Service Unavailable',
          message: `The ${serviceName} service is currently unavailable`
        });
      });
    },
    ...options
  });
  
  // Return a wrapped middleware
  return (req, res, next) => {
    if (circuit.status === 'open') {
      // Circuit is open - service is unavailable
      return res.status(503).json({
        error: 'Service Unavailable',
        message: `The ${serviceName} service is currently unavailable`
      });
    }
    
    // Circuit is closed or half-open - proceed with the request
    proxy(req, res, next);
  };
};

module.exports = { createServiceProxy };
