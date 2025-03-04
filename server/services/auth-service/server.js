const express = require("express");
const cors = require("cors");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const MongoStore = require("connect-mongo");

const connectDB = require("./src/config/database");
const authRoutes = require("./src/routes/auth.routes");

const app = express();
const PORT = process.env.PORT || 5001;
const keySecret = process.env.KEY_SECRET;
const mongoUrl = process.env.MONGO_URI;

require("dotenv").config();

// Enable All CORS Requests
app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// Config cookie parser
app.use(cookieParser());

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session config
app.use(
  session({
    key: "userId",
    secret: keySecret,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
    store: MongoStore.create({
      mongoUrl,
    }),
  })
);

// Kết nối MongoDB
connectDB();

// Routes
app.use("/api/auth", authRoutes);

// Run server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
