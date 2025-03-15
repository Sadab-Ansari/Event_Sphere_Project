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

  io.on("connection", (socket) => {
    console.log(`🔥 User connected: ${socket.id}`);

    socket.on("joinRoom", (userId) => {
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        console.error("❌ Invalid userId format");
        return;
      }
      socket.join(userId);
      console.log(`✅ User ${userId} joined room`);
      io.emit("updateOnlineUsers", Array.from(io.sockets.adapter.rooms.keys()));
    });

    socket.on("sendMessage", async (data) => {
      const { senderId, receiverId, message } = data;
      const newMessage = new Chat({ senderId, receiverId, message });
      await newMessage.save();

      io.to(senderId).emit("receiveMessage", newMessage);
      io.to(receiverId).emit("receiveMessage", newMessage);
    });

    socket.on("disconnect", () => {
      console.log(`❌ User disconnected: ${socket.id}`);
      io.emit("updateOnlineUsers", Array.from(io.sockets.adapter.rooms.keys()));
    });
  });

  return io;
};

module.exports = setupSocket;
