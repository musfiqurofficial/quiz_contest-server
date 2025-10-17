const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

// Import routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const quizRoutes = require("./routes/quiz");
const questionRoutes = require("./routes/question");
const eventRoutes = require("./routes/event");
const participationRoutes = require("./routes/participation");
const bannerRoutes = require("./routes/banner");
const offerRoutes = require("./routes/offer");
const judgeRoutes = require("./routes/judge");
const timeInstructionRoutes = require("./routes/timeInstruction");
const faqRoutes = require("./routes/faq");
const messagingRoutes = require("./routes/messaging");

// Import middleware
const errorHandler = require("./middleware/errorHandler");
const notFound = require("./middleware/notFound");

const app = express();

// Security middleware
app.use(helmet());
app.use(compression());

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: "Too many requests from this IP, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api/", limiter);
app.use("/api/v1/", limiter);

// CORS configuration
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
    optionsSuccessStatus: 200,
  })
);

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
} else {
  app.use(morgan("combined"));
}

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Server is running",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

// API info endpoint
app.get("/api", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Quiz Contest API",
    version: "1.0.0",
    endpoints: {
      auth: "/api/auth",
      users: "/api/users",
      quiz: "/api/quiz",
      questions: "/api/questions",
      events: "/api/events",
      participation: "/api/participation",
      banner: "/api/banner",
      offers: "/api/offers",
      judge: "/api/judge",
      timeInstruction: "/api/time-instruction",
      faq: "/api/faq",
      messaging: "/api/messaging",
    },
    documentation: "See API_ENDPOINTS.md for detailed documentation",
  });
});

// API v1 info endpoint (for backward compatibility)
app.get("/api/v1", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Quiz Contest API v1",
    version: "1.0.0",
    endpoints: {
      auth: "/api/v1/auth",
      users: "/api/v1/users",
      quiz: "/api/v1/quiz",
      questions: "/api/v1/questions",
      events: "/api/v1/events",
      participation: "/api/v1/participation",
      banner: "/api/v1/banner",
      offers: "/api/v1/offers",
      judge: "/api/v1/judge",
      timeInstruction: "/api/v1/time-instruction",
      faq: "/api/v1/faq",
      messaging: "/api/v1/messaging",
    },
    documentation: "See API_ENDPOINTS.md for detailed documentation",
  });
});

// API routes (v1 - for backward compatibility)
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/quiz", quizRoutes);
app.use("/api/v1/questions", questionRoutes);
app.use("/api/v1/events", eventRoutes);
app.use("/api/v1/participation", participationRoutes);
app.use("/api/v1/banner", bannerRoutes);
app.use("/api/v1/offers", offerRoutes);
app.use("/api/v1/judge", judgeRoutes);
app.use("/api/v1/time-instruction", timeInstructionRoutes);
app.use("/api/v1/faq", faqRoutes);
app.use("/api/v1/messaging", messagingRoutes);

// API routes (current version)
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/quiz", quizRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/participation", participationRoutes);
app.use("/api/banner", bannerRoutes);
app.use("/api/offers", offerRoutes);
app.use("/api/judge", judgeRoutes);
app.use("/api/time-instruction", timeInstructionRoutes);
app.use("/api/faq", faqRoutes);
app.use("/api/messaging", messagingRoutes);

// Static files (for uploaded images)
app.use("/uploads", express.static("uploads"));

// Handle favicon.ico requests
app.get("/favicon.ico", (req, res) => {
  res.status(204).end();
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Database connection
const connectDB = async () => {
  try {
    const mongoURI =
      process.env.NODE_ENV === "test"
        ? process.env.MONGODB_TEST_URI
        : process.env.MONGODB_URI;

    // ✅ Fixed: Removed deprecated options
    await mongoose.connect(mongoURI);

    console.log(
      `MongoDB connected successfully in ${process.env.NODE_ENV} mode`
    );
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

// Start server
const PORT = process.env.PORT || 5000;
const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(
      `🚀 Server running on port ${PORT} in ${process.env.NODE_ENV} mode`
    );
    console.log(`📊 Health check: http://localhost:${PORT}/health`);
    console.log(`🔗 API Base URL: http://localhost:${PORT}/api`);
  });
};

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.log("Unhandled Promise Rejection:", err.message);
  process.exit(1);
});

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.log("Uncaught Exception:", err.message);
  process.exit(1);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received. Shutting down gracefully...");
  mongoose.connection.close(() => {
    console.log("MongoDB connection closed.");
    process.exit(0);
  });
});

startServer();
module.exports = app;
