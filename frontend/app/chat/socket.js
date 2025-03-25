// Socket Configuration
import { io } from "socket.io-client";

// Use environment variable for flexibility
const SOCKET_SERVER_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// Prevent duplicate connections
if (!globalThis.socket) {
  globalThis.socket = io(SOCKET_SERVER_URL, {
    withCredentials: true,
    transports: ["websocket"],
    reconnection: true,
    reconnectionAttempts: 10, // Increased attempts for better resilience
    reconnectionDelay: 3000, // Start with 3s delay
    reconnectionDelayMax: 10000, // Use exponential backoff (max 10s)
    timeout: 15000, // Increase connection timeout to 15s
  });

  const socket = globalThis.socket;

  socket.on("connect", () =>
    console.log(`✅ Connected to WebSocket: ${socket.id}`)
  );

  socket.on("connect_error", (err) =>
    console.error("❌ WebSocket error:", err.message)
  );

  socket.on("disconnect", (reason) =>
    console.warn("⚠️ WebSocket disconnected:", reason)
  );

  // Debugging logs (only for development)
  if (process.env.NODE_ENV === "development") {
    socket.on("reconnect_attempt", (attempt) =>
      console.log(`🔄 Reconnecting to WebSocket... Attempt ${attempt}`)
    );
    socket.on("reconnect_failed", () =>
      console.warn("❌ WebSocket reconnection failed")
    );
  }
}

export default globalThis.socket;
