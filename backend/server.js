const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const session = require("express-session");
const passport = require("passport");
const connectDB = require("./config/db");
const eventRoutes = require("./routes/eventRoutes");

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Configure Session Middleware
app.use(
  session({
    secret: "your_secret_key", // Change this to a strong secret
    resave: false,
    saveUninitialized: true,
  })
);

// Initialize Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Import and Load Passport Config
require("./config/passport");

console.log("✅ Server is starting...");

// Load Routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");

console.log("✅ Registering routes...");
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);

console.log("✅ Routes registered successfully.");
console.log("✅ Registering event routes...");
app.use("/api/events", eventRoutes);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
