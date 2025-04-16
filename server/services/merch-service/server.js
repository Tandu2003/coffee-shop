const express = require("express");
const cors = require("cors");

const connectDB = require("./src/config/database");
const merchRoutes = require("./src/routes/merch.routes");

require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5003;

// Enable All CORS Requests
app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// Middleware
app.use(express.json({limit: "50mb"}));
app.use(express.urlencoded({ extended: true , limit: "50mb"}));

// Kết nối MongoDB
connectDB();

// Routes
app.use("/api/merch", merchRoutes);

// Run server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
