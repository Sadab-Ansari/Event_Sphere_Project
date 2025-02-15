"use client";

import { useState } from "react";
import Link from "next/link";
import EventSearch from "./EventSearch";

const eventsData = [
  {
    id: 1,
    title: "Tech Fest 2024",
    date: "March 15, 2024",
    location: "College Auditorium",
  },
  {
    id: 2,
    title: "Cultural Night",
    date: "April 5, 2024",
    location: "Open Ground",
  },
  {
    id: 3,
    title: "Hackathon 2024",
    date: "May 10, 2024",
    location: "Computer Lab",
  },
];

const EventList = () => {
  const [filteredEvents, setFilteredEvents] = useState(eventsData);

  const handleSearch = (query) => {
    const filtered = eventsData.filter((event) =>
      event.title.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredEvents(filtered);
  };

  return (
    <section className="py-10">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-6">Upcoming Events</h2>

        {/* Search Bar */}
        <div className="mb-6">
          <EventSearch onSearch={handleSearch} />
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event) => (
              <div
                key={event.id}
                className="bg-white p-6 rounded-lg shadow-md text-center"
              >
                <h3 className="text-xl font-semibold">{event.title}</h3>
                <p className="text-gray-600">{event.date}</p>
                <p className="text-gray-600">{event.location}</p>
                <Link
                  href={`/events/${event.id}`}
                  className="mt-4 inline-block bg-cyan-700 text-white px-4 py-2 rounded-md hover:bg-cyan-800"
                >
                  View Details
                </Link>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">No events found.</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default EventList;
