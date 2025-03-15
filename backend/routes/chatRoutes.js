const express = require("express");
const mongoose = require("mongoose");
const { sendMessage, getMessages } = require("../controllers/chatController");
const User = require("../models/userModel"); // Import the User model

const router = express.Router();

// 📌 Middleware to validate MongoDB ObjectIds (Handles both params & body)
const validateObjectIds = (req, res, next) => {
  let { senderId, receiverId } = req.method === "POST" ? req.body : req.params;

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

// ✅ Route to dynamically get receiverId excluding the current user
router.get("/getReceiverId/:userId", async (req, res) => {
  const { userId } = req.params;

  console.log("🔍 Fetching receiverId for user:", userId);

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    console.error("❌ Invalid userId format!");
    return res.status(400).json({ error: "Invalid userId format" });
  }

  try {
    // Find any user excluding the current user
    const receiver = await User.findOne({ _id: { $ne: userId } });

    if (!receiver) {
      console.error("❌ No receiver found!");
      return res.status(404).json({ error: "No receiver found" });
    }

    console.log("✅ Receiver found with ID:", receiver._id);
    return res.status(200).json({ receiverId: receiver._id });
  } catch (error) {
    console.error("❌ Error fetching receiverId:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// 📌 Route to send a message
router.post("/send", validateObjectIds, async (req, res, next) => {
  try {
    console.log("🟢 API Call: POST /send");

    const { message } = req.body;

    if (!message || typeof message !== "string" || !message.trim()) {
      console.error("❌ Missing or empty message!");
      return res.status(400).json({ error: "Message cannot be empty" });
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
