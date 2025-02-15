"use client";

import { useState } from "react";

const AdminPanel = () => {
  const [menu, setMenu] = useState("dashboard");

  return (
    <div className="container mx-auto px-6 py-10">
      <h2 className="text-4xl font-bold text-center mb-6">Admin Panel</h2>

      {/* Sidebar Navigation */}
      <div className="flex flex-col md:flex-row">
        <aside className="w-full md:w-1/4 bg-gray-200 p-4 rounded-lg">
          <button
            onClick={() => setMenu("dashboard")}
            className="block w-full text-left px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-md mb-2"
          >
            Dashboard
          </button>
          <button
            onClick={() => setMenu("events")}
            className="block w-full text-left px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-md mb-2"
          >
            Manage Events
          </button>
          <button
            onClick={() => setMenu("users")}
            className="block w-full text-left px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-md mb-2"
          >
            Manage Users
          </button>
          <button
            onClick={() => setMenu("notifications")}
            className="block w-full text-left px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-md mb-2"
          >
            Notifications
          </button>
        </aside>

        {/* Content Area */}
        <main className="w-full md:w-3/4 p-6 bg-white rounded-lg shadow-md ml-0 md:ml-6">
          {menu === "dashboard" && (
            <p className="text-lg">Welcome to the Admin Dashboard!</p>
          )}
          {menu === "events" && (
            <p className="text-lg">Here you can manage events.</p>
          )}
          {menu === "users" && (
            <p className="text-lg">Manage registered users here.</p>
          )}
          {menu === "notifications" && (
            <p className="text-lg">Send event notifications to users.</p>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminPanel;
