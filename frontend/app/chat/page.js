"use client";
import { useState, useEffect } from "react";
import io from "socket.io-client";
import ChatBox from "./chatBox"; // Import ChatBox

const socket = io("http://localhost:5000"); // Backend URL

export default function ChatPage() {
  const [userId, setUserId] = useState(null);
  const [receiverId, setReceiverId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true); // Added loading state

  useEffect(() => {
    if (typeof window !== "undefined") {
      console.log("🔹 Checking localStorage for userId...");
      const storedUserId = localStorage.getItem("userId");

      if (storedUserId && storedUserId !== "null") {
        try {
          // Only parse if storedUserId is a valid JSON object
          setUserId(
            storedUserId.startsWith("{")
              ? JSON.parse(storedUserId)
              : storedUserId
          );
          console.log("✅ Found userId:", storedUserId);
        } catch (error) {
          console.error("❌ Error parsing userId from localStorage:", error);
          setUserId(null);
        }
      } else {
        console.warn("⚠️ No userId found in localStorage!");
      }

      // 🔹 Fetch receiverId dynamically
      fetch("http://localhost:5000/api/getReceiverId") // Replace with actual API endpoint
        .then((res) => res.json())
        .then((data) => {
          if (data.receiverId) {
            setReceiverId(data.receiverId);
          } else {
            console.warn("⚠️ No receiverId found!");
          }
        })
        .catch((err) => console.error("❌ Error fetching receiverId:", err))
        .finally(() => setLoading(false)); // Mark loading as false
    }
  }, []);

  useEffect(() => {
    if (userId && receiverId) {
      socket.on("receiveMessage", (newMessage) => {
        setMessages((prev) => [...prev, newMessage]);
      });

      return () => {
        socket.off("receiveMessage");
      };
    }
  }, [userId, receiverId]);

  const sendMessage = (message) => {
    if (!userId || !receiverId) {
      console.error("❌ Cannot send message: Missing userId or receiverId");
      return;
    }

    const messageData = { senderId: userId, receiverId, message };

    console.log("📤 Sending message:", messageData); // Debugging

    fetch("http://localhost:5000/api/chat/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(messageData),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          console.error("❌ Error sending message:", data.error);
        } else {
          console.log("✅ Message sent successfully:", data);
          setMessages((prev) => [...prev, messageData]);
        }
      })
      .catch((err) => console.error("❌ Failed to send message:", err));
  };

  return (
    <div className="max-w-lg mx-auto mt-10 border rounded-lg shadow-lg bg-white">
      {loading ? (
        <p className="text-center p-4">Loading chat...</p>
      ) : userId && receiverId ? (
        <ChatBox
          userId={userId}
          receiverId={receiverId}
          sendMessage={sendMessage}
        />
      ) : (
        <p className="text-center p-4 text-red-500">⚠️ Unable to load chat.</p>
      )}
    </div>
  );
}
