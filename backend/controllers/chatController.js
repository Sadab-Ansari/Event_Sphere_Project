const mongoose = require("mongoose");
const Chat = require("../models/chatModel");
const User = require("../models/userModel"); // Import User model

// ✅ Send a message
const sendMessage = async (req, res) => {
  try {
    const { senderId, receiverId, message } = req.body;
    const io = req.app.get("io");

    console.log("🟢 Received API Call: sendMessage");

    // Validate required fields
    if (!senderId || !receiverId || !message.trim()) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Validate ObjectId format
    if (
      !mongoose.Types.ObjectId.isValid(senderId) ||
      !mongoose.Types.ObjectId.isValid(receiverId)
    ) {
      return res.status(400).json({ error: "Invalid senderId or receiverId" });
    }

    // Validate sender and receiver existence
    const [senderExists, receiverExists] = await Promise.all([
      User.exists({ _id: senderId }),
      User.exists({ _id: receiverId }),
    ]);

    if (!senderExists || !receiverExists) {
      return res
        .status(404)
        .json({ error: "Sender or Receiver does not exist" });
    }

    // Save message to DB
    const newMessage = await new Chat({
      senderId,
      receiverId,
      message: message.trim(),
    }).save();

    console.log("✅ Message saved successfully:", newMessage);

    // Emit message to sender and receiver
    if (io) {
      io.to(senderId.toString()).emit("receiveMessage", newMessage);
      if (senderId.toString() !== receiverId.toString()) {
        io.to(receiverId.toString()).emit("receiveMessage", newMessage);
      }
    } else {
      console.error("❌ io instance is undefined");
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.error("❌ Error in sendMessage:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// ✅ Get messages between two users
const getMessages = async (req, res) => {
  try {
    const { senderId, receiverId } = req.params;

    console.log("🟢 Received API Call: getMessages");

    if (!senderId || !receiverId) {
      return res
        .status(400)
        .json({ error: "Both senderId and receiverId are required" });
    }

    if (
      !mongoose.Types.ObjectId.isValid(senderId) ||
      !mongoose.Types.ObjectId.isValid(receiverId)
    ) {
      return res.status(400).json({ error: "Invalid senderId or receiverId" });
    }

    // Fetch messages sorted by creation time
    const messages = await Chat.find({
      $or: [
        { senderId, receiverId },
        { senderId: receiverId, receiverId: senderId },
      ],
    }).sort({ createdAt: 1 });

    console.log("✅ Messages fetched successfully:", messages.length);
    res.status(200).json(messages);
  } catch (error) {
    console.error("❌ Error in getMessages:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { sendMessage, getMessages };
