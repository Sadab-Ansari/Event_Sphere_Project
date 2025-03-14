const { Server } = require("socket.io");
const mongoose = require("mongoose");
const Chat = require("../models/chatModel");

const setupSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000", // ✅ Ensure this matches frontend
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log(`🔥 User connected: ${socket.id}`);

    // ✅ Handle joining a room (userId as room)
    socket.on("joinRoom", (userId) => {
      if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
        console.error("❌ Invalid userId:", userId);
        socket.emit("errorMessage", { error: "Invalid userId format" });
        return;
      }
      socket.join(userId);
      console.log(`✅ User joined room: ${userId}`);
    });

    // ✅ Handle sending messages
    socket.on("sendMessage", async (messageData) => {
      try {
        let { senderId, receiverId, message } = messageData;

        console.log("📩 Incoming Message Data:", messageData);

        // ✅ Validate sender, receiver, and message
        if (!senderId || !receiverId || !message?.trim()) {
          console.error("❌ Missing fields");
          socket.emit("errorMessage", { error: "All fields are required" });
          return;
        }

        if (
          !mongoose.Types.ObjectId.isValid(senderId) ||
          !mongoose.Types.ObjectId.isValid(receiverId)
        ) {
          console.error("❌ Invalid ObjectId");
          socket.emit("errorMessage", { error: "Invalid user ID format" });
          return;
        }

        // ✅ Ensure MongoDB connection
        if (mongoose.connection.readyState !== 1) {
          console.error("❌ MongoDB not connected!");
          socket.emit("errorMessage", { error: "Database connection error" });
          return;
        }

        // ✅ Save message to MongoDB
        const newMessage = new Chat({
          senderId,
          receiverId,
          message: message.trim(),
        });
        await newMessage.save();

        // ✅ Emit message to both sender and receiver
        io.to(senderId.toString()).emit("receiveMessage", newMessage);
        io.to(receiverId.toString()).emit("receiveMessage", newMessage);
        console.log(
          `📩 Message sent from ${senderId} to ${receiverId}: ${message}`
        );
      } catch (error) {
        console.error("❌ Error saving message:", error);
        socket.emit("errorMessage", { error: "Message failed to send" });
      }
    });

    // ✅ Handle disconnect
    socket.on("disconnect", () => {
      console.log(`❌ User disconnected: ${socket.id}`);
    });
  });

  return io;
};

module.exports = setupSocket;
