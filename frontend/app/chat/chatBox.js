"use client";

import { useState, useEffect, useRef } from "react";
import socket from "./socket";
import { IoSend, IoArrowBack } from "react-icons/io5";

export default function ChatBox({ userId, receiverId, onBack }) {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!userId) {
      console.error("❌ ChatBox did not receive userId.");
      return;
    }

    if (!receiverId) {
      console.warn("⏳ Waiting for receiverId...");
      return;
    }

    const fetchMessages = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/chat/${userId}/${receiverId}`
        );
        if (!response.ok) throw new Error("Failed to fetch messages");

        const data = await response.json();
        setMessages(data);
      } catch (error) {
        console.error("❌ Error fetching messages:", error.message);
      }
    };

    fetchMessages();

    const handleReceiveMessage = (newMessage) => {
      setMessages((prev) => [...prev, newMessage]);
    };

    socket.on("receiveMessage", handleReceiveMessage);

    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
    };
  }, [userId, receiverId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!message.trim()) return;
    if (!userId || !receiverId) {
      console.error("❌ Missing senderId or receiverId");
      return;
    }

    const messageData = {
      senderId: userId,
      receiverId,
      message: message.trim(),
    };

    try {
      const response = await fetch("http://localhost:5000/api/chat/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(messageData),
      });

      if (!response.ok) throw new Error("Failed to send message");

      socket.emit("sendMessage", messageData);
      setMessages((prev) => [...prev, messageData]);
      setMessage("");
    } catch (error) {
      console.error("❌ Error sending message:", error.message);
    }
  };

  return (
    <div className="flex flex-col h-screen w-full bg-white shadow-lg rounded-lg border border-gray-300">
      <div className="flex items-center justify-between bg-blue-600 text-white px-4 py-3">
        <button onClick={onBack} className="text-2xl">
          <IoArrowBack />
        </button>
        <h2 className="text-lg font-semibold">
          {receiverId ? "Chat" : "Waiting for receiver..."}
        </h2>
        <div className="w-8"></div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-100">
        {!receiverId ? (
          <p className="text-center text-gray-500">Waiting for receiver...</p>
        ) : messages.length === 0 ? (
          <p className="text-center text-gray-500">
            No messages yet. Start chatting! 💬
          </p>
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`max-w-[75%] px-4 py-2 rounded-lg ${
                msg.senderId === userId
                  ? "bg-blue-500 text-white self-end ml-auto"
                  : "bg-gray-300 text-black self-start"
              }`}
            >
              {msg.message}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="flex items-center gap-2 bg-white border-t px-4 py-3">
        <input
          type="text"
          placeholder="Type a message..."
          className="flex-1 px-3 py-2 border rounded-full focus:outline-none focus:ring focus:ring-blue-300"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          disabled={!receiverId}
        />
        <button
          onClick={sendMessage}
          className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700"
          disabled={!receiverId}
        >
          <IoSend size={20} />
        </button>
      </div>
    </div>
  );
}
