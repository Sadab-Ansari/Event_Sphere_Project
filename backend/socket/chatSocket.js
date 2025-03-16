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

  const onlineUsers = new Map(); // Track userId and socket.id

  io.on("connection", (socket) => {
    console.log(`🔥 User connected: ${socket.id}`);

    socket.on("joinRoom", (userId) => {
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        console.error("❌ Invalid userId format");
        return;
      }

      userId = userId.toString();

      if (!onlineUsers.has(userId)) {
        onlineUsers.set(userId, socket.id);
        socket.join(userId);
        console.log(`✅ User ${userId} joined room.`);
        io.emit("updateOnlineUsers", Array.from(onlineUsers.keys()));
      }
    });

    socket.on("sendMessage", async (data) => {
      const { senderId, receiverId, message } = data;

      if (!senderId || !receiverId || !message || !message.trim()) {
        console.error("❌ Invalid message data");
        return;
      }

      try {
        const savedMessage = await Chat.create({
          senderId,
          receiverId,
          message,
          createdAt: new Date(),
        });

        // Emit to receiver and sender after saving
        io.to(receiverId).emit("receiveMessage", savedMessage);
        io.to(senderId).emit("receiveMessage", savedMessage);

        console.log(`📨 Message sent from ${senderId} to ${receiverId}`);
      } catch (error) {
        console.error("❌ Error saving message:", error);
      }
    });

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
