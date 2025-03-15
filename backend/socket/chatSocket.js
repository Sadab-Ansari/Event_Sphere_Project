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

  const onlineUsers = new Map(); // Map to track userId and socket.id

  io.on("connection", (socket) => {
    console.log(`🔥 User connected: ${socket.id}`);

    // ✅ User joins their own room for personal messages
    socket.on("joinRoom", (userId) => {
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        console.error("❌ Invalid userId format");
        return;
      }

      userId = userId.toString();

      // Avoid duplicate room joins
      if (!onlineUsers.has(userId)) {
        onlineUsers.set(userId, socket.id);
        socket.join(userId);
        console.log(`✅ User ${userId} joined room.`);
        io.emit("updateOnlineUsers", Array.from(onlineUsers.keys()));
      }
    });

    // ✅ Handle sending message and emitting it
    socket.on("sendMessage", async (data) => {
      const { senderId, receiverId, message } = data;

      if (!senderId || !receiverId || !message || !message.trim()) {
        console.error("❌ Invalid message data");
        return;
      }

      // The message should already be saved via the API, so only emit here
      const formattedMessage = {
        senderId,
        receiverId,
        message,
        createdAt: new Date(),
      };

      // Emit message to sender and receiver
      io.to(senderId).emit("receiveMessage", formattedMessage);
      io.to(receiverId).emit("receiveMessage", formattedMessage);

      // Emit a notification if the receiver is online but not in the chat room
      if (onlineUsers.has(receiverId)) {
        io.to(receiverId).emit("newMessageNotification", {
          senderId,
          message: "You have a new message!",
        });
      }
    });

    // ✅ Handle user disconnection
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
