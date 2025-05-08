const express = require('express');
const cors = require('cors');

const connectDB = require('./src/config/database');
const orderRoutes = require('./src/routes/order.routes');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5004;

// Enable All CORS Requests
app.use(
  cors({
    origin: process.env.CLIENT_URL || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  }),
);

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/orders', orderRoutes);

// Run server
app.listen(PORT, () => {
  console.log(`🚀 Order Service is running on http://localhost:${PORT}`);
});
