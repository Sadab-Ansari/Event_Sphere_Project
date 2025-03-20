"use client";
import { useState, useEffect } from "react";

const UpcomingEvent = () => {
  const [nearestEvent, setNearestEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [countdown, setCountdown] = useState(null);
  const [bannerExists, setBannerExists] = useState(true); // Track banner existence

  useEffect(() => {
    const fetchNearestEvent = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/events/nearest", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch nearest event");
        }

        const event = await res.json();
        console.log("Fetched Event:", event); // Debugging log
        setNearestEvent(event);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNearestEvent();
  }, []);

  useEffect(() => {
    if (!nearestEvent) return;

    const eventDateTime = new Date(nearestEvent.date);
    const [time, period] = nearestEvent.time.split(" ");
    let [hours, minutes] = time.split(":").map(Number);

    if (period === "PM" && hours !== 12) hours += 12;
    if (period === "AM" && hours === 12) hours = 0;

    eventDateTime.setHours(hours, minutes, 0, 0);

    const updateCountdown = () => {
      const now = new Date();
      const diff = eventDateTime - now;

      if (diff <= 0) {
        setCountdown("In Progress");
        return;
      }

      if (diff <= 3600000) {
        const minutes = Math.floor((diff % 3600000) / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);
        setCountdown(`${minutes}m ${seconds}s`);
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [nearestEvent]);

  if (loading) {
    return <p className="text-center">Loading upcoming event...</p>;
  }

  if (error || !nearestEvent) {
    return <p className="text-center">No upcoming events found.</p>;
  }

  return (
    <div className="rounded-lg shadow-lg overflow-hidden h-60 flex flex-col">
      {/* Banner (Hidden when event is 1 hour away) */}
      <div className="relative flex-1">
        {/* "Upcoming Event" Label - Positioned Above the Banner */}
        <div className="absolute top-2 left-2 bg-blue-600 text-white px-3 py-1 rounded-md text-sm font-semibold z-20">
          Upcoming Event
        </div>

        {/* Banner (or Countdown when 1 hour remains) */}
        {countdown ? (
          <div className="w-full h-48 flex items-center justify-center bg-gray-100">
            <p className="text-2xl font-bold text-red-500">{countdown}</p>
          </div>
        ) : nearestEvent.banner && bannerExists ? (
          <img
            src={
              nearestEvent.banner
                ? nearestEvent.banner
                : "/assets/default-placeholder.png"
            }
            alt={nearestEvent.title}
            className="w-full h-48 object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/assets/default-placeholder.png";
            }}
          />
        ) : (
          <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-500">
            No Banner Available
          </div>
        )}
      </div>

      {/* Event Title, Date & Time (Always Visible) */}
      <div className="mb-2 flex items-center justify-center space-x-1">
        <h3 className="text-xl font-semibold">{nearestEvent.title}</h3>
        <p className="text-sm text-gray-600 ">
          ({new Date(nearestEvent.date).toLocaleDateString()} at{" "}
          {nearestEvent.time})
        </p>
      </div>
    </div>
  );
};

export default UpcomingEvent;
