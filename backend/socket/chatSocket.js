const { Server } = require("socket.io");
const mongoose = require("mongoose");
const Chat = require("../models/chatModel");

const setupSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
      credentials: true,
    },
  });

  const onlineUsers = new Map(); // Use Map to track userId and socket.id

  io.on("connection", (socket) => {
    console.log(`🔥 User connected: ${socket.id}`);

    // Joining room
    socket.on("joinRoom", (userId) => {
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        console.error("❌ Invalid userId format");
        return;
      }

      // Prevent duplicate room joins
      if (!onlineUsers.has(userId)) {
        onlineUsers.set(userId, socket.id);
        socket.join(userId);
        console.log(`✅ User ${userId} joined room.`);
        io.emit("updateOnlineUsers", Array.from(onlineUsers.keys()));
      }
    });

    // Sending message
    socket.on("sendMessage", async (data) => {
      const { senderId, receiverId, message } = data;

      if (!senderId || !receiverId || !message) {
        console.error("❌ Invalid message data");
        return;
      }

      // Save message to database first
      const newMessage = new Chat({ senderId, receiverId, message });

      try {
        await newMessage.save();

        // Emit the message to both sender and receiver if they are online
        if (onlineUsers.has(senderId)) {
          io.to(senderId).emit("receiveMessage", newMessage);
        }

        if (onlineUsers.has(receiverId)) {
          io.to(receiverId).emit("receiveMessage", newMessage);
        }
      } catch (error) {
        console.error("❌ Error saving message to DB:", error.message);
      }
    });

    // Disconnecting and cleaning up
    socket.on("disconnect", () => {
      for (const [userId, id] of onlineUsers.entries()) {
        if (id === socket.id) {
          onlineUsers.delete(userId);
          console.log(`⚠️ User ${userId} disconnected`);
          break;
        }
      }
      io.emit("updateOnlineUsers", Array.from(onlineUsers.keys()));
    });
  });

  return io;
};

module.exports = setupSocket;
