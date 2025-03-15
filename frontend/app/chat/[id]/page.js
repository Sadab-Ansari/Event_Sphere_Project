"use client";
import { useState, useEffect } from "react";
import socket from "../socket"; // Correct path to socket.js
import ChatBox from "../chatBox";

export default function ChatPage() {
  const [userId, setUserId] = useState(null);
  const [receiverId, setReceiverId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [typingUser, setTypingUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId && storedUserId !== "null") {
      setUserId(storedUserId);

      fetch(`http://localhost:5000/api/chat/getReceiverId/${storedUserId}`)
        .then((res) => {
          if (!res.ok) throw new Error("Failed to fetch receiverId");
          return res.json();
        })
        .then((data) => {
          if (data.receiverId) {
            setReceiverId(data.receiverId);
          }
        })
        .catch((err) => {
          console.error("❌ Error fetching receiverId:", err);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (userId) {
      // Join the user's room
      socket.emit("joinRoom", userId);

      // Define handler functions to ensure proper cleanup
      const handleReceiveMessage = (newMessage) => {
        setMessages((prev) => [...prev, newMessage]);
      };

      const handleUpdateOnlineUsers = (users) => {
        setOnlineUsers(users);
      };

      const handleUserTyping = ({ senderId }) => {
        setTypingUser(senderId);
        setTimeout(() => setTypingUser(null), 3000);
      };

      // Attach listeners
      socket.on("receiveMessage", handleReceiveMessage);
      socket.on("updateOnlineUsers", handleUpdateOnlineUsers);
      socket.on("userTyping", handleUserTyping);

      // Cleanup listeners on component unmount or dependency change
      return () => {
        socket.off("receiveMessage", handleReceiveMessage);
        socket.off("updateOnlineUsers", handleUpdateOnlineUsers);
        socket.off("userTyping", handleUserTyping);
      };
    }
  }, [userId]);

  return (
    <div className="max-w-lg mx-auto mt-10 border rounded-lg shadow-lg bg-white">
      {loading ? (
        <p className="text-center p-4">Loading chat...</p>
      ) : userId && receiverId ? (
        <>
          <ChatBox
            userId={userId}
            receiverId={receiverId}
            messages={messages} // Pass messages to ChatBox
          />
          {typingUser && (
            <p className="text-center text-sm text-gray-500">
              ✍️ User {typingUser} is typing...
            </p>
          )}
          <p className="text-center text-sm text-gray-500">
            Online Users: {onlineUsers.length}
          </p>
        </>
      ) : (
        <p className="text-center p-4 text-red-500">⚠️ Unable to load chat.</p>
      )}
    </div>
  );
}
