"use client";

import { useState, useEffect } from "react";

const EventStats = () => {
  const [stats, setStats] = useState({
    totalEvents: 50,
    participants: 1200,
    organizers: 20,
  });

  return (
    <section className="bg-gray-100 py-10">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold mb-6">Event Highlights</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h3 className="text-2xl font-bold">{stats.totalEvents}+</h3>
            <p className="text-gray-600">Events Hosted</p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h3 className="text-2xl font-bold">{stats.participants}+</h3>
            <p className="text-gray-600">Participants</p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h3 className="text-2xl font-bold">{stats.organizers}+</h3>
            <p className="text-gray-600">Organizers</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EventStats;
