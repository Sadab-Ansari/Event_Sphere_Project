"use client";

import { useState } from "react";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";

const userData = {
  name: "John Doe",
  email: "johndoe@example.com",
  registeredEvents: [
    {
      id: 1,
      title: "Tech Fest 2024",
      date: "March 15, 2024",
      location: "College Auditorium",
    },
    {
      id: 2,
      title: "Hackathon 2024",
      date: "May 10, 2024",
      location: "Computer Lab",
    },
  ],
};

const Dashboard = () => {
  const [user, setUser] = useState(userData);

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-6 py-10">
        <h2 className="text-4xl font-bold text-center mb-6">Dashboard</h2>

        {/* User Info */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h3 className="text-2xl font-semibold">Welcome, {user.name}!</h3>
          <p className="text-gray-600">{user.email}</p>
        </div>

        {/* Registered Events */}
        <h3 className="text-2xl font-semibold mb-4">Your Registered Events</h3>
        <div className="grid md:grid-cols-2 gap-6">
          {user.registeredEvents.length > 0 ? (
            user.registeredEvents.map((event) => (
              <div key={event.id} className="bg-white p-6 rounded-lg shadow-md">
                <h4 className="text-xl font-semibold">{event.title}</h4>
                <p className="text-gray-600">
                  {event.date} | {event.location}
                </p>
                <Link
                  href={`/events/${event.id}`}
                  className="mt-4 inline-block bg-cyan-700 text-white px-4 py-2 rounded-md hover:bg-cyan-800"
                >
                  View Event
                </Link>
              </div>
            ))
          ) : (
            <p className="text-gray-500">
              You haven't registered for any events yet.
            </p>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Dashboard;
