import { io } from "socket.io-client";

const socket = io("http://localhost:5000", {
  withCredentials: true,
  transports: ["websocket"],
  reconnection: true,
  reconnectionAttempts: 5,
});

// ✅ Debugging connection
socket.on("connect", () => {
  console.log("✅ Connected to WebSocket:", socket.id);
});

socket.on("connect_error", (err) => {
  console.error("❌ WebSocket connection error:", err.message);
});

socket.on("disconnect", (reason) => {
  console.warn("⚠️ Disconnected from WebSocket:", reason);
});

export default socket;
