require('dotenv').config();

module.exports = {
  port: process.env.PORT || 3001,
  environment: process.env.NODE_ENV || 'development',
  
  services: {
    product: {
      restUrl: process.env.PRODUCT_SERVICE_URL || 'http://localhost:5002',
      grpcUrl: process.env.PRODUCT_GRPC_URL || 'localhost:50051'
    },
    merch: {
      restUrl: process.env.MERCH_SERVICE_URL || 'http://localhost:5003',
      grpcUrl: process.env.MERCH_GRPC_URL || 'localhost:50052'
    },
    auth: {
      restUrl: process.env.AUTH_SERVICE_URL || 'http://localhost:5001',
      grpcUrl: process.env.AUTH_GRPC_URL || 'localhost:50053'
    }
  },
  
  security: {
    jwtSecret: process.env.JWT_SECRET || 'default_jwt_secret_for_development_only',
    rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
    rateLimitMaxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100
  },
  
  cors: {
    allowedOrigins: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000']
  },
  
  logging: {
    level: process.env.LOG_LEVEL || 'info'
  }
};
