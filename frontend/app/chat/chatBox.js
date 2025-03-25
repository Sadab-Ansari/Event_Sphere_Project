"use client";

import { useState, useEffect, useRef } from "react";
import socket from "./socket";
import { IoSend } from "react-icons/io5";
import { format } from "date-fns";

export default function ChatBox({ userId, receiverId }) {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [receiver, setReceiver] = useState(null);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!userId || !receiverId) {
      console.warn("Missing userId or receiverId:", { userId, receiverId });
      return;
    }

    setMessages([]); // Clear messages when switching chats

    const fetchMessages = async () => {
      try {
        setLoading(true);
        console.log(`Fetching messages for user ${userId} with ${receiverId}`);
        const response = await fetch(
          `http://localhost:5000/api/chat/${userId}/${receiverId}`
        );

        if (!response.ok)
          throw new Error(`Failed to fetch messages: ${response.statusText}`);
        const data = await response.json();
        setMessages(data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchReceiverDetails = async () => {
      try {
        console.log(`Fetching receiver details for ID: ${receiverId}`);
        const response = await fetch(
          `http://localhost:5000/api/users/${receiverId}`
        );

        if (!response.ok)
          throw new Error(`Failed to fetch receiver: ${response.statusText}`);

        const data = await response.json();
        setReceiver(data);
      } catch (error) {
        console.error("Error fetching receiver details:", error);
      }
    };

    fetchMessages();
    fetchReceiverDetails();

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
    if (!userId) {
      console.error("Error: Sender ID is missing");
      alert("Cannot send message: User is not logged in.");
      return;
    }
    if (!receiverId) {
      console.error("Error: Receiver ID is missing");
      alert("Cannot send message: Receiver is missing.");
      return;
    }

    console.log(
      "Sending message as userId:",
      userId,
      "to receiverId:",
      receiverId
    );

    const messageData = {
      senderId: userId,
      receiverId,
      message: message.trim(),
      createdAt: new Date().toISOString(),
    };

    try {
      const response = await fetch("http://localhost:5000/api/chat/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(messageData),
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.error || "Message failed to send");
      }

      const savedMessage = await response.json();
      socket.emit("sendMessage", savedMessage);
      setMessages((prev) => [...prev, savedMessage]);
      setMessage("");
    } catch (error) {
      console.error("Error sending message:", error.message);
      alert("Failed to send message. Please try again.");
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Chat Header */}
      <div className="bg-blue-600 text-white px-4 py-3 text-center font-semibold">
        Chat with {receiver ? receiver.name : "Loading..."}
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3">
        {loading ? (
          <p className="text-center text-gray-500">Loading messages...</p>
        ) : messages.length === 0 ? (
          <p className="text-center text-gray-500">
            No messages yet. Start chatting! 💬
          </p>
        ) : (
          messages.map((msg, index) => {
            const isSender = msg.senderId === userId;
            return (
              <div
                key={index}
                className={`w-fit max-w-[75%] px-4 py-2 rounded-2xl shadow-md text-sm break-words ${
                  isSender
                    ? "bg-blue-500 text-white ml-auto"
                    : "bg-gray-300 text-black"
                }`}
              >
                <span>{msg.message}</span>
                <span className="text-[10px] text-gray-500 ml-2">
                  {format(new Date(msg.createdAt), "HH:mm")}
                </span>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Field */}
      <div className="flex items-center gap-2 bg-white border-t px-4 py-3">
        <input
          type="text"
          placeholder="Type a message..."
          className="flex-1 px-4 py-2 border rounded-full shadow-sm focus:outline-none"
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
