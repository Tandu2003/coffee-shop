const express = require('express');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const config = require('./config');
const cors = require('./middleware/cors');
const limiter = require('./middleware/limiter');
const logger = require('./middleware/logging');
const errorHandler = require('./middleware/error-handler');
const { logger: winstonLogger } = require('./middleware/logging');

const authRoutes = require('./routes/auth.routes');
const merchRoutes = require('./routes/merch.routes');
const productRoutes = require('./routes/product.routes');

// Create Express app
const app = express();

// Apply middleware
app.use(helmet());  // Security headers
app.use(cors);      // CORS configuration
app.use(limiter);   // Rate limiting
app.use(logger);    // Request logging
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

// Create protos directory if it doesn't exist
const protosDir = path.join(__dirname, '../protos');
if (!fs.existsSync(protosDir)) {
  fs.mkdirSync(protosDir);
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'up', 
    timestamp: new Date(),
    services: {
      product: {
        url: config.services.product.restUrl,
        grpc: config.services.product.grpcUrl
      },
      merch: {
        url: config.services.merch.restUrl,
        grpc: config.services.merch.grpcUrl
      },
      auth: {
        url: config.services.auth.restUrl,
        grpc: config.services.auth.grpcUrl
      }
    }
  });
});

// Service routes
app.use('/api/auth', authRoutes);
app.use('/api/merch', merchRoutes);
app.use('/api/products', productRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Resource not found' });
});

// Global error handler
app.use(errorHandler);

// Start server
const PORT = config.port || 3001;
app.listen(PORT, () => {
  winstonLogger.info(`API Gateway running on port ${PORT} in ${config.environment} mode`);
});

module.exports = app;
