const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const authMiddleware = async (req, res, next) => {
  try {
    // ✅ Ensure Authorization header exists
    const authHeader = req.header("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized, token missing" });
    }

    // ✅ Extract token
    const token = authHeader.split(" ")[1];

    // ✅ Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded || !decoded.id) {
      return res.status(401).json({ error: "Invalid token" });
    }

    // ✅ Find user and attach to request
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    req.user = user; // Attach user to request
    next();
  } catch (error) {
    console.error("Auth Error:", error);

    if (error.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ error: "Token expired, please login again" });
    }

    return res.status(401).json({ error: "Invalid token" });
  }
};

module.exports = authMiddleware;
