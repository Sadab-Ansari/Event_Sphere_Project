"use client";

import { useState, useEffect, useRef } from "react";
import socket from "./socket";
import { IoSend } from "react-icons/io5";
import { format } from "date-fns";

export default function ChatBox({ userId, receiverId }) {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!userId || !receiverId) return;

    const fetchMessages = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/chat/${userId}/${receiverId}`
        );
        if (!response.ok) throw new Error("Failed to fetch messages");
        const data = await response.json();
        setMessages(data);
      } catch (error) {
        console.error("Error fetching messages:", error.message);
      }
    };

    fetchMessages();

    const handleReceiveMessage = (newMessage) => {
      if (
        (newMessage.senderId === userId &&
          newMessage.receiverId === receiverId) ||
        (newMessage.senderId === receiverId && newMessage.receiverId === userId)
      ) {
        setMessages((prev) => [...prev, newMessage]);
      }
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

    const messageData = {
      senderId: userId,
      receiverId,
      message: message.trim(),
    };

    try {
      await fetch("http://localhost:5000/api/chat/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(messageData),
      });

      setMessage(""); // Clear input after sending
      // Do not emit message from here - let the server handle it after saving
    } catch (error) {
      console.error("Error sending message:", error.message);
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="bg-blue-600 text-white px-4 py-3 text-center font-semibold">
        Chat
      </div>

      <div className="flex-1 p-4 overflow-y-auto space-y-3">
        {messages.length === 0 ? (
          <p className="text-center text-gray-500">
            No messages yet. Start chatting! 💬
          </p>
        ) : (
          messages.map((msg, index) => {
            const isSender =
              msg.senderId === userId || msg.senderId?._id === userId;
            const messageTime = msg.createdAt
              ? format(new Date(msg.createdAt), "HH:mm")
              : "";
            return (
              <div
                key={index}
                className={`w-fit max-w-[75%] px-4 py-2 rounded-2xl shadow-md text-sm whitespace-pre-wrap break-words ${
                  isSender
                    ? "bg-blue-500 text-white self-end ml-auto"
                    : "bg-white text-black self-start"
                }`}
              >
                <div className="flex items-end gap-2">
                  <span>{msg.message}</span>
                  <span className="text-[10px] text-gray-200">
                    {messageTime}
                  </span>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex items-center gap-2 bg-white border-t px-4 py-3">
        <input
          type="text"
          placeholder="Type a message..."
          className="flex-1 px-4 py-2 border rounded-full shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
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
