const mongoose = require("mongoose");
const Chat = require("../models/chatModel");

// Send a message
const sendMessage = async (req, res, io) => {
  try {
    let { senderId, receiverId, message } = req.body;

    console.log("🟢 Received API Call: sendMessage");
    console.log("➡️ Sender ID:", senderId);
    console.log("➡️ Receiver ID:", receiverId);
    console.log("➡️ Message:", message);

    // Validate required fields
    if (!senderId || !receiverId || !message) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Validate ObjectId format
    if (
      !mongoose.Types.ObjectId.isValid(senderId) ||
      !mongoose.Types.ObjectId.isValid(receiverId)
    ) {
      return res.status(400).json({ error: "Invalid senderId or receiverId" });
    }

    senderId = new mongoose.Types.ObjectId(senderId);
    receiverId = new mongoose.Types.ObjectId(receiverId);

    if (!message.trim()) {
      return res.status(400).json({ error: "Message cannot be empty" });
    }

    // Save message to DB
    const newMessage = new Chat({ senderId, receiverId, message });
    await newMessage.save();

    console.log("✅ Message saved successfully:", newMessage);

    // Emit message to both users
    io.to(receiverId.toString()).emit("receiveMessage", newMessage);
    io.to(senderId.toString()).emit("receiveMessage", newMessage);

    res.status(201).json(newMessage);
  } catch (error) {
    console.error("❌ Error in sendMessage:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get messages between two users
const getMessages = async (req, res) => {
  try {
    const { senderId, receiverId } = req.params;

    console.log("🟢 Received API Call: getMessages");
    console.log("➡️ Sender ID:", senderId);
    console.log("➡️ Receiver ID:", receiverId);

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
