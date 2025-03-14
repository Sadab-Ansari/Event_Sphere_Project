const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const session = require("express-session");
const passport = require("passport");
const path = require("path");
const http = require("http");
const connectDB = require("./config/db");
const setupSocket = require("./socket/chatSocket"); // ✅ Modular Socket.IO setup

dotenv.config();

const app = express();
const server = http.createServer(app); // HTTP server for Express & Socket.IO

// ✅ Initialize Socket.IO
const io = setupSocket(server);

// ✅ Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000", // Dynamic Client Origin
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ Secure Session Setup
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your_default_secret",
    resave: false,
    saveUninitialized: false, // More secure
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Secure cookies in production
      sameSite: "lax",
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());
require("./config/passport");

// ✅ Routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const eventRoutes = require("./routes/eventRoutes");
const trafficRoutes = require("./routes/trafficRoutes");
const progressRoutes = require("./routes/progressRoutes");
const eventMessageRoutes = require("./routes/eventMessageRoutes");
const chatRoutes = require("./routes/chatRoutes");

app.use("/api/chat", chatRoutes);
app.use("/api/messages", eventMessageRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/traffic", trafficRoutes);
app.use("/api/progress", progressRoutes);

// ✅ Catch 404 Errors (Not Found)
app.use((req, res, next) => {
  res.status(404).json({ message: "API route not found" });
});

// ✅ Global Error Handler
app.use((err, req, res, next) => {
  console.error("❌ Global Error:", err.stack);
  res
    .status(500)
    .json({ message: "Internal Server Error", error: err.message });
});

// ✅ Start Server After MongoDB Connection
(async () => {
  try {
    await connectDB();
    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
  } catch (error) {
    console.error("❌ MongoDB Connection Failed:", error);
    process.exit(1);
  }
})();
