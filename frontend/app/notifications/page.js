"use client";

import { useState } from "react";

const notificationsData = [
  {
    id: 1,
    message: "Tech Fest 2024 is happening tomorrow!",
    time: "1 hour ago",
  },
  {
    id: 2,
    message: "Cultural Night registration closes soon!",
    time: "3 hours ago",
  },
  { id: 3, message: "Hackathon 2024 winners announced!", time: "Yesterday" },
];

const Notifications = () => {
  const [notifications, setNotifications] = useState(notificationsData);

  return (
    <div className="container mx-auto px-6 py-10">
      <h2 className="text-3xl font-bold text-center mb-6">Notifications</h2>

      {notifications.length > 0 ? (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className="bg-white p-4 rounded-lg shadow-md"
            >
              <p className="text-lg">{notification.message}</p>
              <span className="text-gray-500 text-sm">{notification.time}</span>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No notifications yet.</p>
      )}
    </div>
  );
};

export default Notifications;
