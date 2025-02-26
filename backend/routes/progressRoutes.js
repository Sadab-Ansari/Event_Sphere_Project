const express = require("express");
const {
  getProgress,
  updateProgress,
} = require("../controllers/progressController");
const { protect } = require("../middleware/authMiddleware"); // ✅ Ensure only logged-in users access progress

const router = express.Router();

// ✅ Get Progress
router.get("/", protect, getProgress);

// ✅ Update Progress
router.post("/", protect, updateProgress);

module.exports = router;
