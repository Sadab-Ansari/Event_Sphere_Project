// Socket Configuration
import { io } from "socket.io-client";

const socket = io("http://localhost:5000", {
  withCredentials: true,
  transports: ["websocket"],
  reconnection: true,
  reconnectionAttempts: 5,
});

socket.on("connect", () => console.log("Connected to WebSocket", socket.id));
socket.on("connect_error", (err) =>
  console.error("WebSocket error:", err.message)
);
socket.on("disconnect", (reason) =>
  console.warn("WebSocket disconnected:", reason)
);

export default socket;
