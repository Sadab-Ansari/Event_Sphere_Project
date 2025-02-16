"use client";

import { useState, useEffect } from "react";

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/events/all")
      .then((res) => res.json())
      .then((data) => setEvents(data));
  }, []);

  const filteredEvents = events.filter((event) =>
    event.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-4xl font-bold text-center text-blue-600 mb-8">
        Explore Events
      </h1>

      {/* Search Field */}
      <div className="flex justify-center mb-8">
        <input
          type="text"
          placeholder="Search events..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full max-w-lg p-3 border border-gray-300 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Event List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event) => (
            <div
              key={event._id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden transform hover:scale-105 transition"
            >
              {/* Display Event Banner (If No Image, Use Default Design) */}
              {event.banner ? (
                <img
                  src={`http://localhost:5000${event.banner}`}
                  alt={event.title}
                  className="w-full h-48 object-cover rounded-t-2xl"
                />
              ) : (
                <div className="w-full h-48 bg-gray-300 flex items-center justify-center text-gray-600 text-lg">
                  No Image Available
                </div>
              )}

              {/* Event Details */}
              <div className="p-6 text-center">
                <h2 className="text-2xl font-semibold text-gray-900">
                  {event.title}
                </h2>
                <p className="text-gray-600 text-lg">
                  {new Date(event.date).toDateString()}
                </p>
                <p className="text-gray-500 text-lg">
                  <span className="font-medium">Location:</span>{" "}
                  {event.location}
                </p>

                {/* Buttons (Stacked in Mobile) */}
                <div className="flex flex-col md:flex-row justify-center gap-4 mt-6">
                  <button className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-800 transition">
                    View Details
                  </button>
                  <button className="bg-green-600 text-white px-5 py-2 rounded-md hover:bg-green-800 transition">
                    Participate
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 col-span-full text-xl">
            No events found.
          </p>
        )}
      </div>
    </div>
  );
};

export default EventsPage;
