import { useState, useEffect } from "react"; // Import useState and useEffect
import io from "socket.io-client";
import Link from "next/link";

const socket = io("http://localhost:5000"); // Make sure socket is defined here

const EventMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("📌 Fetching all event messages...");

    const fetchMessages = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/eventMessage/all"
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
  }, []); // This ensures the effect runs only once when the component mounts

  return (
    <div className="bg-gray-100 p-2 rounded-lg shadow-md w-full mx-auto h-full">
      <h2 className="text-xl font-semibold mb-3">Event Messages</h2>

      {loading && <p>Loading messages...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && messages.length === 0 && <p>No messages found.</p>}

      <div className="h-60 overflow-y-auto">
        {/* Scrollable container with fixed height */}
        {!loading && !error && messages.length > 0 && (
          <ul className="space-y-1">
            {messages.map((msg) => (
              <li key={msg._id} className="bg-white p-3 rounded shadow">
                <div className="flex items-center justify-between">
                  <p className="font-medium flex-1">
                    {/* Make the message clickable */}
                    <Link
                      href={`/events`} // Navigate to the event page using the event ID
                      className="text-blue-600 font-semibold hover:underline"
                    >
                      {msg.message || "No message available"}
                    </Link>
                  </p>
                  <span className="text-gray-500 text-sm">
                    ({new Date(msg.timestamp).toLocaleString()})
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default EventMessages;
