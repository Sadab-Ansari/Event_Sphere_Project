"use client";

import { useState, useEffect } from "react";

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/events")
      .then((res) => res.json())
      .then((data) => setEvents(data));
  }, []);

  const filteredEvents = events.filter((event) =>
    event.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100 p-6 ">
      <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">
        Events
      </h1>

      {/* Search Field */}
      <div className="flex justify-center mb-6">
        <input
          type="text"
          placeholder="Search events..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full max-w-lg p-3 border border-gray-300 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Event List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event) => (
            <div key={event._id} className="bg-white p-4 rounded-2xl shadow-lg">
              <h2 className="text-xl font-semibold text-gray-800">
                {event.title}
              </h2>
              <p className="text-gray-600">
                {new Date(event.date).toDateString()}
              </p>
              <p className="text-gray-500">{event.location}</p>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 col-span-full">
            No events found.
          </p>
        )}
      </div>
    </div>
  );
};

export default EventsPage;
