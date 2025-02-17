"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaEdit, FaTrash } from "react-icons/fa"; // Import icons from React Icons

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [userId, setUserId] = useState(null); // Track logged-in user
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Fetch events
    fetch("http://localhost:5000/api/events/all")
      .then((res) => res.json())
      .then((data) => {
        setEvents(data);
        setLoading(false);
      });

    // Fetch logged-in user ID
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

      {/* Search Field */}
      <div className="flex justify-center mb-8">
        <input
          type="text"
          placeholder="Search events..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full max-w-lg p-3 border border-gray-600 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700 text-white placeholder-gray-400"
        />
      </div>

      {/* Event List */}
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
              {/* Event Banner */}
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

              {/* Event Details */}
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
                  <div className="flex gap-2">
                    <button
                      onClick={() => router.push(`/edit-event/${event._id}`)}
                      className="bg-yellow-600 text-white px-4 py-2 rounded-md hover:bg-yellow-700 transition flex items-center gap-2"
                    >
                      <FaEdit /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(event._id)}
                      className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition flex items-center gap-2"
                    >
                      <FaTrash /> Delete
                    </button>
                  </div>
                )}
                {/* Buttons */}
                <div className="flex flex-col md:flex-row justify-center gap-4 mt-6">
                  <button className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 transition">
                    View Details
                  </button>
                  <button className="bg-green-600 text-white px-5 py-2 rounded-md hover:bg-green-700 transition">
                    Participate
                  </button>

                  {/* Show Edit/Delete Only for Event Creator */}
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
