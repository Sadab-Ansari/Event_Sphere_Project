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

  const onlineUsers = new Set(); // Track unique online users

  io.on("connection", (socket) => {
    console.log(`🔥 User connected: ${socket.id}`);

    socket.on("joinRoom", (userId) => {
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        console.error("❌ Invalid userId format");
        return;
      }
      socket.join(userId);
      onlineUsers.add(userId);
      io.emit("updateOnlineUsers", Array.from(onlineUsers));
    });

    socket.on("sendMessage", async (data) => {
      const { senderId, receiverId, message } = data;
      const newMessage = new Chat({ senderId, receiverId, message });
      await newMessage.save();

      io.to(senderId).emit("receiveMessage", newMessage);
      io.to(receiverId).emit("receiveMessage", newMessage);
    });

    socket.on("disconnect", () => {
      onlineUsers.delete(socket.id);
      io.emit("updateOnlineUsers", Array.from(onlineUsers));
    });
  });

  return io;
};

module.exports = setupSocket;
