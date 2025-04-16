require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");
const MongoStore = require("connect-mongo");
const connectDB = require("./src/config/database");
const authRoutes = require("./src/routes/auth.routes");
const accountRoutes = require("./src/routes/account.routes");

const app = express();
const PORT = process.env.PORT || 5001;
const keySecret = process.env.KEY_SECRET;
const mongoUrl = process.env.MONGO_URI;

// BẢO MẬT API VỚI CORS
app.use(
  cors({
    origin: ["http://localhost:3000"], // Chỉ cho phép frontend truy cập
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// CHỐNG TẤN CÔNG BRUTE-FORCE & RATE LIMITING
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 phút
  max: 100, // Giới hạn 100 requests mỗi IP trong 15 phút
  message: { message: "Quá nhiều yêu cầu từ IP này, vui lòng thử lại sau!" },
  headers: true,
});
app.use(limiter);

// BẢO MẬT DỮ LIỆU BẰNG HELMET
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'", "https://api.example.com"],
        frameSrc: ["'none'"],
      },
    },
    dnsPrefetchControl: { allow: false },
    frameguard: { action: "deny" },
    hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
    referrerPolicy: { policy: "strict-origin-when-cross-origin" },
    xssFilter: true,
  })
);

//Middleware khác
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//CẤU HÌNH SESSION & KẾT NỐI DATABASE
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
connectDB();

//ĐỊNH TUYẾN API
app.use("/api/auth", authRoutes);
app.use("/api/accounts", accountRoutes);

// KHỞI CHẠY SERVER
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
