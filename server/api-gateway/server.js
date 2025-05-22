const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(express.json());

// Proxy configuration
const services = {
  auth: 'http://auth-service:5001',
  product: 'http://product-service:5002',
  cart: 'http://cart-service:5005',
  order: 'http://order-service:5004',
  merch: 'http://merch-service:5003',
  chatbot: 'http://chatbot-service:5006',
};

// Proxy routes
app.use(
  '/api/auth',
  createProxyMiddleware({
    target: services.auth,
    changeOrigin: true,
    pathRewrite: {
      '^/api/auth': '/api/auth',
    },
  }),
);

app.use(
  '/api/products',
  createProxyMiddleware({
    target: services.product,
    changeOrigin: true,
    pathRewrite: {
      '^/api/products': '/api/products',
    },
  }),
);

app.use(
  '/api/cart',
  createProxyMiddleware({
    target: services.cart,
    changeOrigin: true,
    pathRewrite: {
      '^/api/cart': '/api/cart',
    },
  }),
);

app.use(
  '/api/orders',
  createProxyMiddleware({
    target: services.order,
    changeOrigin: true,
    pathRewrite: {
      '^/api/orders': '/api/orders',
    },
  }),
);

app.use(
  '/api/merch',
  createProxyMiddleware({
    target: services.merch,
    changeOrigin: true,
    pathRewrite: {
      '^/api/merch': '/api/merch',
    },
  }),
);

app.use(
  '/api/chatbot',
  createProxyMiddleware({
    target: services.chatbot,
    changeOrigin: true,
    pathRewrite: {
      '^/api/chatbot': '/api/chatbot',
    },
  }),
);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

app.listen(PORT, () => {
  console.log(`API Gateway is running on port ${PORT}`);
});
