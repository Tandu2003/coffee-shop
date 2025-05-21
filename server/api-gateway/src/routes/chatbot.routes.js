const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const config = require('../config');
const circuitBreaker = require('../middleware/circuit-breaker');

const router = express.Router();

const chatbotServiceUrl = config.services.chatbot.url;

// Proxy for chatbot service with circuit breaker
router.use(
  '/',
  circuitBreaker('chatbotService'),
  createProxyMiddleware({
    target: chatbotServiceUrl,
    changeOrigin: true,
    pathRewrite: {
      [`^/api/chatbot`]: '', // remove base path
    },
    onError: (err, req, res) => {
      console.error('Chatbot proxy error:', err);
      res.status(503).json({ message: 'Chatbot service unavailable' });
    },
  })
);

module.exports = router;
