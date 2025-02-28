"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const UpcomingEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showParticipationModal, setShowParticipationModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const router = useRouter();

  useEffect(() => {
fetch("http://localhost:5000/api/events/upcoming")
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched events data:", data); // Log the fetched data
        if (Array.isArray(data)) {
          setEvents(data);
        } else {
          console.error("Fetched data is not an array:", data);
          setEvents([]); // Set to empty array if data is not an array
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching upcoming events:", error);
        setLoading(false);
      });


      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched events data:", data); // Log the fetched data
        if (Array.isArray(data)) {
          setEvents(data);
        } else {
          console.error("Fetched data is not an array:", data);
          setEvents([]); // Set to empty array if data is not an array
        }
        setLoading(false);
      })

console.log("Fetched events data:", data); // Log the fetched data
if (Array.isArray(data)) {
  setEvents(data);
} else {
  console.error("Fetched data is not an array:", data);
  setEvents([]); // Set to empty array if data is not an array

console.log("Fetched events data:", data); // Log the fetched data
if (Array.isArray(data)) {
  setEvents(data);
} else {
  console.error("Fetched data is not an array:", data);
  setEvents([]); // Set to empty array if data is not an array

      .then((res) => res.json())
      .then((data) => {
        setEvents(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching upcoming events:", error);
        setLoading(false);
      });
  }, []);

  const handleParticipate = (event) => {
    setSelectedEvent(event);
    setShowParticipationModal(true);
  };

  const confirmParticipation = async () => {
    if (!selectedEvent) return;
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in to participate.");
      return;
    }

    const response = await fetch(
      `http://localhost:5000/api/events/register/${selectedEvent._id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ interest: selectedEvent.interest }),
      }
    );
    const data = await response.json();
    if (response.ok) {
      alert("Successfully registered for the event!");
      setShowParticipationModal(false);
    } else {
      alert(data.error || "Failed to register.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-800 p-6">
      <h1 className="text-4xl font-bold text-center text-blue-400 mb-8">
        Upcoming Events
      </h1>

      {loading ? (
        <p className="text-center text-gray-400">Loading events...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event) => (
            <motion.div
              key={event._id}
              className="bg-gray-700 rounded-2xl shadow-lg overflow-hidden"
              initial={{ scale: 1 }}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 200, damping: 10 }}
            >
              <div className="relative">
                {event.banner ? (
                  <img
                    src={`http://localhost:5000${event.banner}`}
                    alt={event.title}
                    className="w-full h-48 object-cover rounded-t-2xl"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-600 flex items-center justify-center text-gray-400">
                    No Image Available
                  </div>
                )}
              </div>
              <div className="p-6 text-center">
                <h2 className="text-2xl font-semibold text-white">
                  {event.title}
                </h2>
                <p className="text-gray-300 text-lg">
                  {new Date(event.date).toDateString()} at {event.time}
                </p>
                <div className="flex justify-center gap-4 mt-6">
                  <button
                    onClick={() => handleParticipate(event)}
                    className="bg-green-600 text-white px-5 py-2 rounded-md hover:bg-green-700 transition"
                  >
                    Participate
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Participation Modal */}
      <AnimatePresence>
        {showParticipationModal && selectedEvent && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 100 }}
            className="fixed inset-0 flex items-center justify-center p-4 bg-black bg-opacity-50 z-50"
          >
            <div className="bg-gray-800 rounded-lg w-96 p-6 shadow-xl">
              <h3 className="text-2xl font-bold text-center mb-6 text-white">
                Confirm Participation
              </h3>
              <div className="mt-8 flex justify-between">
                <button
                  onClick={() => setShowParticipationModal(false)}
                  className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmParticipation}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Confirm
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
