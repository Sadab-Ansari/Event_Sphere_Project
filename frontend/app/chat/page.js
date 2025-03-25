"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import socket from "./socket";
import ChatBox from "./chatBox";

export default function ChatListPage() {
  const router = useRouter();
  const [userId, setUserId] = useState(null);
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (!storedUserId) return;

    setUserId(storedUserId);
    socket.emit("getChats", storedUserId);

    socket.on("chatsList", (chatList) => {
      setChats(chatList);
      if (chatList.length > 0) {
        setSelectedChat(chatList[0].userId); // ✅ Open first chat automatically
      }
    });

    socket.on("receiveMessage", (newMessage) => {
      setChats((prevChats) => {
        const updatedChats = [...prevChats];
        const chatIndex = updatedChats.findIndex(
          (chat) => chat.userId === newMessage.senderId
        );

        if (chatIndex !== -1) {
          updatedChats[chatIndex].lastMessage = newMessage.message;
        } else {
          updatedChats.unshift({
            userId: newMessage.senderId,
            username: newMessage.senderName || `User ${newMessage.senderId}`,
            lastMessage: newMessage.message,
          });
        }
        return updatedChats;
      });
    });

    return () => {
      socket.off("chatsList");
      socket.off("receiveMessage");
    };
  }, []);

  return (
    <div className="flex h-screen w-full bg-gray-100 p-4 justify-center items-center">
      <div className="flex h-[85vh] w-full max-w-4xl bg-white rounded-xl shadow-lg border overflow-hidden">
        {/* Chat List Sidebar */}
        <div className="w-1/3 bg-gray-900 text-white p-4 overflow-y-auto">
          <h2 className="text-xl font-semibold mb-4">Chats</h2>
          {chats.map((chat) => (
            <div
              key={chat.userId}
              className={`flex items-center p-3 rounded cursor-pointer ${
                selectedChat === chat.userId
                  ? "bg-gray-700"
                  : "hover:bg-gray-800"
              }`}
              onClick={() => setSelectedChat(chat.userId)}
            >
              <div className="w-10 h-10 bg-gray-500 rounded-full mr-3"></div>{" "}
              {/* Avatar */}
              <div>
                <p className="font-medium">
                  {chat.username || `User ${chat.userId}`}
                </p>
                <p className="text-sm text-gray-400">
                  {chat.lastMessage || "No messages yet..."}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Chat Window */}
        <div className="w-2/3 flex flex-col">
          {selectedChat ? (
            <ChatBox userId={userId} receiverId={selectedChat} />
          ) : (
            <p className="text-center text-gray-500 mt-20">
              Select a user to start chatting.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
