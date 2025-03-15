"use client";
import { useState, useEffect } from "react";
import socket from "./socket"; // Correct path to socket.js
import ChatBox from "./chatBox";

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
      socket.emit("joinRoom", userId);

      socket.on("receiveMessage", (newMessage) => {
        setMessages((prev) => [...prev, newMessage]);
      });

      socket.on("updateOnlineUsers", (users) => {
        setOnlineUsers(users);
      });

      socket.on("userTyping", ({ senderId }) => {
        setTypingUser(senderId);
        setTimeout(() => setTypingUser(null), 3000);
      });

      return () => {
        socket.off("receiveMessage");
        socket.off("updateOnlineUsers");
        socket.off("userTyping");
      };
    }
  }, [userId]);

  const sendMessage = (message) => {
    if (!userId || !receiverId) {
      console.error("❌ Missing userId or receiverId");
      return;
    }

    const messageData = { senderId: userId, receiverId, message };
    socket.emit("sendMessage", messageData);
  };

  return (
    <div className="max-w-lg mx-auto mt-10 border rounded-lg shadow-lg bg-white">
      {loading ? (
        <p className="text-center p-4">Loading chat...</p>
      ) : userId && receiverId ? (
        <>
          <ChatBox
            userId={userId}
            receiverId={receiverId}
            sendMessage={sendMessage}
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
