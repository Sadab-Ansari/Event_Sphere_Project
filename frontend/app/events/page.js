"use client";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { FaEdit, FaTrash } from "react-icons/fa";

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();
  const successMessage = searchParams.get("success");

  useEffect(() => {
    fetch("http://localhost:5000/api/events/all")
      .then((res) => res.json())
      .then((data) => {
        setEvents(data);
        setLoading(false);
      });

    const token = localStorage.getItem("token");
    if (token) {
      fetch("http://localhost:5000/api/user/profile", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => setUserId(data.user._id))
        .catch((error) => console.error("Error fetching user profile:", error));
    }
  }, []);

  const handleDelete = async (eventId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this event?"
    );
    if (!confirmDelete) return;

    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `http://localhost:5000/api/events/delete/${eventId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.ok) {
        setEvents(events.filter((event) => event._id !== eventId));
      } else {
        console.error("Failed to delete event");
      }
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  const filteredEvents = events.filter((event) =>
    event.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-800 p-6">
      <h1 className="text-4xl font-bold text-center text-blue-400 mb-8">
        Explore Events
      </h1>

      {successMessage && (
        <div className="mb-6 p-3 bg-green-500/10 text-green-500 rounded-lg text-center">
          {successMessage}
        </div>
      )}

      <div className="flex justify-center mb-8">
        <input
          type="text"
          placeholder="Search events..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full max-w-lg p-3 border border-gray-600 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700 text-white placeholder-gray-400"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading ? (
          <p className="text-center text-gray-400 col-span-full text-xl">
            Loading events...
          </p>
        ) : filteredEvents.length > 0 ? (
          filteredEvents.map((event) => (
            <div
              key={event._id}
              className="bg-gray-700 rounded-2xl shadow-lg overflow-hidden transform hover:scale-105 transition duration-300"
            >
              <div className="relative">
                {event.banner ? (
                  <img
                    src={`http://localhost:5000${event.banner}`}
                    alt={event.title}
                    className="w-full h-48 object-cover rounded-t-2xl"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-600 flex items-center justify-center text-gray-400 text-lg">
                    No Image Available
                  </div>
                )}
                {userId === event.organizer && (
                  <div className="absolute top-2 right-2 flex gap-2 z-50">
                    <button
                      onClick={() => router.push(`/edit-event/${event._id}`)}
                      className="bg-white/80 p-2 rounded-full hover:bg-white transition shadow-lg"
                    >
                      <FaEdit className="text-gray-800" />
                    </button>
                    <button
                      onClick={() => handleDelete(event._id)}
                      className="bg-white/80 p-2 rounded-full hover:bg-white transition shadow-lg"
                    >
                      <FaTrash className="text-red-600" />
                    </button>
                  </div>
                )}
                {console.log(
                  "Current User ID:",
                  userId,
                  "Event Organizer:",
                  event.organizer
                )}
              </div>

              <div className="p-6 text-center">
                <h2 className="text-2xl font-semibold text-white">
                  {event.title}
                </h2>
                <p className="text-gray-300 text-lg">
                  {new Date(event.date).toDateString()}
                </p>
                <p className="text-gray-400 text-lg">
                  <span className="font-medium text-gray-300">Location:</span>{" "}
                  {event.location}
                </p>

                {userId === event.organizer && (
                  <div className="flex justify-center gap-4 mb-4">
                    <button
                      onClick={() => router.push(`/edit-event/${event._id}`)}
                      className="bg-white/80 p-2 rounded-full hover:bg-white transition shadow-lg"
                    >
                      <FaEdit className="text-gray-800" />
                    </button>
                    <button
                      onClick={() => handleDelete(event._id)}
                      className="bg-white/80 p-2 rounded-full hover:bg-white transition shadow-lg"
                    >
                      <FaTrash className="text-red-600" />
                    </button>
                  </div>
                )}
                {userId === event.organizer && (
                  <div className="flex justify-center gap-4 mb-4">
                    <button
                      onClick={() => router.push(`/edit-event/${event._id}`)}
                      className="bg-white/80 p-2 rounded-full hover:bg-white transition shadow-lg"
                    >
                      <FaEdit className="text-gray-800" />
                    </button>
                    <button
                      onClick={() => handleDelete(event._id)}
                      className="bg-white/80 p-2 rounded-full hover:bg-white transition shadow-lg"
                    >
                      <FaTrash className="text-red-600" />
                    </button>
                  </div>
                )}
                <div className="flex flex-col md:flex-row justify-center gap-4 mt-6">
                  <button className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 transition">
                    View Details
                  </button>
                  <button className="bg-green-600 text-white px-5 py-2 rounded-md hover:bg-green-700 transition">
                    Participate
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-400 col-span-full text-xl">
            No events found.
          </p>
        )}
      </div>
    </div>
  );
};

export default EventsPage;
