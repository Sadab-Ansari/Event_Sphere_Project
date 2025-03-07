const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const session = require("express-session");
const passport = require("passport");
const path = require("path");
const connectDB = require("./config/db");

// ✅ Load Environment Variables
dotenv.config();

const app = express();

// ✅ Middleware
app.use(
  cors({
    origin: "http://localhost:3000", // Allow only your frontend
    credentials: true, // Allow cookies & sessions
    methods: ["GET", "POST", "PUT", "DELETE"], // Allowed HTTP methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Serve Uploaded Images (Profile & Event Banners)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ Session Setup
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your_default_secret",
    resave: false,
    saveUninitialized: true,
  })
);

// ✅ Initialize Passport
app.use(passport.initialize());
app.use(passport.session());
require("./config/passport");

// ✅ Routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const eventRoutes = require("./routes/eventRoutes");
const trafficRoutes = require("./routes/trafficRoutes");
const progressRoutes = require("./routes/progressRoutes"); // ✅ Ensure this file exists
const eventMessageRoutes = require("./routes/eventMessageRoutes");

app.use("/api/messages", eventMessageRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/traffic", trafficRoutes);
app.use("/api/progress", progressRoutes); // ✅ Include Progress API

// ✅ Global Error Handler
app.use((err, req, res, next) => {
  console.error("❌ Global Error:", err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

// ✅ Start Server After MongoDB Connection
(async () => {
  try {
    await connectDB();
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
  } catch (error) {
    console.error("❌ MongoDB Connection Failed:", error);
    process.exit(1);
  }
})();
