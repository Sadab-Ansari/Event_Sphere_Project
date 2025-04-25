import { io } from "socket.io-client";

const SOCKET_SERVER_URL = process.env.NEXT_PUBLIC_API_URL;
// Adjust if your backend runs on a different port

const socket = io(SOCKET_SERVER_URL, {
  transports: ["websocket"],
});

// Function to listen for new event messages
export const subscribeToEventMessages = (callback) => {
  if (!socket) return;

  socket.on("newEventMessage", (message) => {
    callback(message);
  });
};

// Function to stop listening for event messages
export const unsubscribeFromEventMessages = () => {
  if (!socket) return;

  socket.off("newEventMessage");
};

export default socket;
