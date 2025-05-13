const express = require("express");
const cors = require("cors");

const connectDB = require("./src/config/database");
const cartRoutes = require("./src/routes/cart.routes");

require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5004;

// Enable CORS
app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
connectDB();

// Routes
app.use("/api/cart", cartRoutes);

// Run server
app.listen(PORT, () => {
  console.log(`🚀 Cart Service is running on http://localhost:${PORT}`);
});
