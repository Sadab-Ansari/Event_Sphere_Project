"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import socket from "../socket";
import ChatBox from "../chatBox";

export default function ChatPage() {
  const { id: receiverId } = useParams(); // Get receiverId from URL
  const router = useRouter();
  const [userId, setUserId] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  //  Load userId from localStorage
  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId && storedUserId !== "null") {
      setUserId(storedUserId);
    }
    setLoading(false);
  }, []);

  //  Join room only when userId is available
  useEffect(() => {
    if (userId) {
      socket.emit("joinRoom", userId);
      socket.on("updateOnlineUsers", setOnlineUsers);

      return () => {
        socket.off("updateOnlineUsers");
      };
    }
  }, [userId]);

  return (
    <div className="flex h-full w-full items-center justify-center bg-gray-200 p-4">
      <div className="flex h-[80vh] w-[90vw] max-w-5xl bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-300">
        {/* Chat List Sidebar */}
        <div className="w-1/4 bg-gray-900 text-white p-4 overflow-y-auto border-r border-gray-300">
          <h2 className="text-lg font-semibold mb-4">Chats</h2>
          {onlineUsers.length === 0 ? (
            <p className="text-gray-500">No online users.</p>
          ) : (
            onlineUsers.map((user) => (
              <div
                key={user.userId} //  Unique key added
                className={`p-2 rounded cursor-pointer ${
                  receiverId === user.userId
                    ? "bg-gray-700"
                    : "hover:bg-gray-800"
                }`}
                onClick={() => router.push(`/chat/${user.userId}`)} //  Use router.push()
              >
                <p>{user.username || `User ${user.userId}`}</p>
                <span className="text-sm text-gray-400">
                  Last message preview...
                </span>
              </div>
            ))
          )}
        </div>

        {/* Chat Window */}
        <div className="w-3/4 flex-grow">
          {loading ? (
            <p className="text-center p-4">Loading chat...</p>
          ) : userId && receiverId ? (
            <ChatBox userId={userId} receiverId={receiverId} />
          ) : (
            <p className="text-center p-4 text-gray-500">
              Select a user to start chatting.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
