"use client";
import { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:5000");

const EventMessages = ({ userId }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("🔍 Debugging: Received userId in frontend:", userId);

    if (!userId || typeof userId !== "string" || userId.trim() === "") {
      console.error("❌ Invalid userId. Cannot fetch messages.");
      setError("Invalid user ID provided.");
      setLoading(false);
      return;
    }

    const fetchMessages = async () => {
      console.log("📌 Fetching messages for userId:", userId);

      try {
        const response = await fetch(
          `http://localhost:5000/api/eventMessage/user/${userId}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("✅ API Response:", data);
        setMessages(data.messages || []);
      } catch (error) {
        console.error("❌ Error fetching messages:", error.message);
        setError("Failed to load event messages.");
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();

    socket.on("newEventMessage", (newMessage) => {
      console.log("📩 New real-time message received:", newMessage);
      setMessages((prevMessages) => [newMessage, ...prevMessages]);
    });

    return () => {
      socket.off("newEventMessage");
    };
  }, [userId]);

  return (
    <div className="bg-gray-100 p-4 rounded-lg shadow-md w-full max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-3">Event Messages</h2>

      {loading && <p>Loading messages...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && messages.length === 0 && <p>No messages found.</p>}

      {!loading && !error && messages.length > 0 && (
        <ul className="space-y-2">
          {messages.map((msg) => (
            <li key={msg._id} className="bg-white p-3 rounded shadow">
              <p className="font-medium">
                <span className="text-blue-600 font-semibold">
                  {msg.user?.name || "Unknown User"}
                </span>{" "}
                created the event{" "}
                <span className="text-green-600 font-semibold">
                  "{msg.event?.title || "Unknown Event"}"
                </span>
              </p>
              <span className="text-gray-500 text-sm">
                ({new Date(msg.timestamp).toLocaleString()})
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default EventMessages;
