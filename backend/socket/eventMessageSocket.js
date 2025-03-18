const { Server } = require("socket.io");

const setupEventMessageSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000", // ✅ Allow frontend to connect
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("⚡ New client connected to Event Messages");

    socket.on("disconnect", () => {
      console.log("⚠️ Client disconnected from Event Messages");
    });
  });

  return io;
};

module.exports = setupEventMessageSocket;
