import { io } from "socket.io-client";

const socket = io("http://localhost:5000", { withCredentials: true });

// ✅ Debugging connection
socket.on("connect", () => {
  console.log("✅ Connected to WebSocket:", socket.id);
});

socket.on("errorMessage", (error) => {
  console.error("❌ WebSocket Error:", error);
});

export default socket;
