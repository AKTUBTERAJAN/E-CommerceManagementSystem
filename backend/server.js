require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");

const connectDB = require("./config/db");

// Routes
const userRoutes = require("./routes/userRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const productRoutes = require("./routes/productRoutes");
const supportRoutes = require("./routes/supportRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");
const walletRoutes = require("./routes/walletRoutes");
const watchlistRoutes = require("./routes/watchlistRoutes");
const addressRoutes = require("./routes/addressRoutes");
const aiRoutes = require("./routes/aiRoutes");

const app = express();

// Trust reverse proxy (Render, Heroku, Vercel, Cloudflare)
app.set("trust proxy", 1);

// MongoDB Connect
connectDB();

// Production CORS Configuration
const allowedOrigins = [
  process.env.FRONTEND_URL,
  process.env.VITE_FRONTEND_URL,
  process.env.DASHBOARD_URL,
  process.env.VITE_DASHBOARD_URL,
  "https://bigmall-frontend-sage.vercel.app",
  "https://bigmall-dashboard.vercel.app",
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:3000",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:5174",
]
  .filter(Boolean)
  .map((url) => url.trim().replace(/\/+$/, ""));

const corsOptions = {
  origin: function (origin, callback) {
    // Allow non-browser requests (Postman, curl, server-to-server)
    if (!origin) return callback(null, true);

    const cleanOrigin = origin.trim().replace(/\/+$/, "");
    const isExplicit = allowedOrigins.includes(cleanOrigin);
    const isVercel = /^https:\/\/(bigmall-[a-z0-9-]+|[a-z0-9-]+-bigmall)\.vercel\.app$/i.test(cleanOrigin);
    const isRender = /^https:\/\/[a-z0-9-]+\.onrender\.com$/i.test(cleanOrigin);
    const isLocal = /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(cleanOrigin);

    if (isExplicit || isVercel || isRender || isLocal) {
      callback(null, true);
    } else {
      callback(null, true);
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Production Health Check Endpoints
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    service: "Bigmall Backend API",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "production",
  });
});

app.get("/", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "Bigmall Backend API Server is Running",
    version: "1.0.0",
    docs: "/api/ai/status",
  });
});

// Routes
app.use("/api/user", userRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/product", productRoutes);
app.use("/api/support", supportRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/wallet", walletRoutes);
app.use("/api/watchlist", watchlistRoutes);
app.use("/api/address", addressRoutes);
app.use("/api/ai", aiRoutes);

// Global Error Handling Middleware
app.use((err, req, res, next) => {
  console.error("Unhandled API Error:", err.stack || err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server Running on Port ${PORT} [${process.env.NODE_ENV || "production"}]`);
});
