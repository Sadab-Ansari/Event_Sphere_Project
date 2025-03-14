const express = require("express");
const mongoose = require("mongoose");
const { sendMessage, getMessages } = require("../controllers/chatController");

const router = express.Router();

// 📌 Middleware to validate MongoDB ObjectIds
const validateObjectIds = (req, res, next) => {
  const { senderId, receiverId } = req.params;

  console.log("🔍 Validating ObjectIds...");
  console.log("➡️ Sender ID:", senderId);
  console.log("➡️ Receiver ID:", receiverId);

  if (
    !mongoose.Types.ObjectId.isValid(senderId) ||
    !mongoose.Types.ObjectId.isValid(receiverId)
  ) {
    console.error("❌ Invalid senderId or receiverId!");
    return res.status(400).json({ error: "Invalid senderId or receiverId" });
  }
  next();
};

// 📌 Route to send a message
router.post("/send", async (req, res, next) => {
  try {
    const { senderId, receiverId, message } = req.body;

    console.log("🟢 API Call: POST /send");
    console.log("➡️ Sender ID:", senderId);
    console.log("➡️ Receiver ID:", receiverId);
    console.log("➡️ Message:", message);

    // Check for missing fields
    if (
      !senderId ||
      !receiverId ||
      typeof message !== "string" ||
      !message.trim()
    ) {
      console.error("❌ Missing required fields!");
      return res.status(400).json({ error: "All fields are required" });
    }

    // Validate ObjectIds
    if (
      !mongoose.Types.ObjectId.isValid(senderId) ||
      !mongoose.Types.ObjectId.isValid(receiverId)
    ) {
      console.error("❌ Invalid MongoDB ObjectIds!");
      return res.status(400).json({ error: "Invalid senderId or receiverId" });
    }

    await sendMessage(req, res, next);
  } catch (error) {
    console.error("❌ Error in POST /send:", error);
    next(error);
  }
});

// 📌 Route to get messages between two users
router.get("/:senderId/:receiverId", validateObjectIds, getMessages);

module.exports = router;
