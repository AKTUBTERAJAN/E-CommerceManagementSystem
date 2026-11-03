require("dotenv").config();

// Startup validation: Ensure critical JWT_SECRET environment variable is configured
if (!process.env.JWT_SECRET || process.env.JWT_SECRET.trim() === "") {
  console.error("FATAL ERROR: JWT_SECRET environment variable is missing or empty. Backend startup aborted.");
  process.exit(1);
}

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

// MongoDB Connect
connectDB();

// Middleware
// Trusted origins for CORS restriction
const defaultAllowedOrigins = [
  "https://bigmall-frontend-sage.vercel.app",
  "https://bigmall-dashboard.vercel.app",
  "http://localhost:5173",
  "http://localhost:5174",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:5174",
];

const envFrontend = (process.env.FRONTEND_URL || process.env.VITE_FRONTEND_URL || "").trim().replace(/\/+$/, "");
const envDashboard = (process.env.DASHBOARD_URL || process.env.VITE_DASHBOARD_URL || "").trim().replace(/\/+$/, "");

const allowedOrigins = Array.from(
  new Set([
    ...defaultAllowedOrigins,
    ...(envFrontend ? [envFrontend] : []),
    ...(envDashboard ? [envDashboard] : []),
  ])
);

const corsOptions = {
  origin: (origin, callback) => {
    // Allow non-browser requests (e.g. server-to-server, curl, Postman, mobile apps) with no Origin header
    if (!origin) {
      return callback(null, true);
    }

    const normalizedOrigin = origin.trim().replace(/\/+$/, "");
    if (allowedOrigins.includes(normalizedOrigin)) {
      return callback(null, true);
    }

    return callback(new Error("Not allowed by CORS"));
  },
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

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

// Test Route
// CORS error handler
app.use((err, req, res, next) => {
  if (err && err.message === "Not allowed by CORS") {
    return res.status(403).json({ success: false, error: "Access denied by CORS policy" });
  }
  next(err);
});

app.get("/", (req, res) => {
  res.send("Backend Running...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server Running on Port ${PORT}`);
});
