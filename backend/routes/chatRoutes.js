const express = require("express");
const mongoose = require("mongoose");
const { sendMessage, getMessages } = require("../controllers/chatController");
const User = require("../models/userModel");
const Chat = require("../models/chatModel"); // Import Chat model for new routes

const router = express.Router();

// 📌 Middleware to validate MongoDB ObjectIds
const validateObjectIds = (req, res, next) => {
  let { senderId, receiverId } = req.method === "POST" ? req.body : req.params;

  if (
    !mongoose.Types.ObjectId.isValid(senderId) ||
    !mongoose.Types.ObjectId.isValid(receiverId)
  ) {
    return res.status(400).json({ error: "Invalid senderId or receiverId" });
  }
  next();
};

// ✅ Route to dynamically get receiverId excluding the current user
router.get("/getReceiverId/:userId", async (req, res) => {
  const { userId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ error: "Invalid userId format" });
  }

  try {
    const receiver = await User.findOne({ _id: { $ne: userId } });
    if (!receiver) return res.status(404).json({ error: "No receiver found" });

    return res.status(200).json({ receiverId: receiver._id });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✅ Route to send a message
router.post("/send", validateObjectIds, async (req, res, next) => {
  try {
    const { message } = req.body;
    if (!message || typeof message !== "string" || !message.trim()) {
      return res.status(400).json({ error: "Message cannot be empty" });
    }

    await sendMessage(req, res, next);
  } catch (error) {
    next(error);
  }
});

// ✅ Route to get messages between two users
router.get("/:senderId/:receiverId", validateObjectIds, getMessages);

// ✅ NEW: Route to get all conversations for a user
router.get("/conversations/:userId", async (req, res) => {
  const { userId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ error: "Invalid userId format" });
  }

  try {
    const conversations = await Chat.aggregate([
      {
        $match: {
          $or: [
            { senderId: new mongoose.Types.ObjectId(userId) },
            { receiverId: new mongoose.Types.ObjectId(userId) },
          ],
        },
      },
      {
        $group: {
          _id: {
            senderId: "$senderId",
            receiverId: "$receiverId",
          },
          lastMessage: { $last: "$message" },
          updatedAt: { $last: "$updatedAt" },
        },
      },
      {
        $sort: { updatedAt: -1 },
      },
    ]);

    res.status(200).json(conversations);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
