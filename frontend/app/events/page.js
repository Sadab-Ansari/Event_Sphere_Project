"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { FaComments } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
// import SidebarMenu from "@/components/SideMenu";

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedInterest, setSelectedInterest] = useState("");
  const [showParticipationModal, setShowParticipationModal] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const successMessage = searchParams.get("success");

  useEffect(() => {
    fetch("http://localhost:5000/api/events/all")
      .then((res) => res.json())
      .then((data) => {
        setEvents(data);
        setLoading(false);
      });

    const token = localStorage.getItem("token");
    if (token) {
      fetch("http://localhost:5000/api/user/profile", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.user) {
            setUserId(data.user._id);
          } else {
            console.error("User data is undefined");
          }
        })
        .catch((error) => console.error("Error fetching user profile:", error));
    }
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
        body: JSON.stringify({
          participant: {
            user: userId,
            interests: [selectedInterest],
          },
        }),
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

  const handleChat = (organizer) => {
    if (!userId) {
      alert("You must be logged in to start a chat.");
      return;
    }
    router.push(`/chat/${organizer._id}`);
  };

  const filteredEvents = events.filter((event) =>
    event.title.toLowerCase().includes(searchQuery.trim().toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-gray-900 space-x-2 ">
      {/* md:ml-16 */}
      {/* Sidebar */}
      {/* <div className=" w-16 min-h-screen bg-gray-800">
        <SidebarMenu />
      </div> */}

      {/* Main Content */}
      <div className="flex-1 bg-gray-800 pr-3 pb-6 pt-6 pl-3">
        <h1 className="text-4xl font-bold text-center text-blue-400 mb-8">
          Explore Events
        </h1>

        {/* Search Bar */}
        <div className="flex justify-center mb-8">
          <input
            type="text"
            placeholder="Search events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full max-w-lg p-3 border border-green-900 rounded-2xl bg-gray-700 text-white focus:border-green-900 focus:border-4"
          />
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <p className="text-center text-gray-400 col-span-full text-xl">
              Loading events...
            </p>
          ) : filteredEvents.length > 0 ? (
            filteredEvents.map((event) => (
              <div
                key={event._id}
                className="bg-gray-700 rounded-2xl shadow-lg overflow-hidden transition-transform duration-300 hover:scale-105"
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

                <div className="p-3 text-center">
                  <h2 className="text-2xl font-semibold text-white">
                    {event.title}
                  </h2>
                  <p className="text-gray-300 text-lg">
                    {new Date(event.date).toDateString()} at {event.time}
                  </p>

                  <p className="text-gray-400 text-lg">
                    <span className="font-medium text-gray-300">Location:</span>{" "}
                    {event.location}
                  </p>

                  <div className="flex justify-center gap-4 mt-6">
                    <button
                      onClick={() => handleChat(event.organizer)}
                      className="bg-green-600 text-white px-5 py-2 rounded-md hover:bg-green-700 transition flex items-center gap-2"
                    >
                      <FaComments /> Chat
                    </button>
                    <button
                      onClick={() => handleParticipate(event)}
                      className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-green-700 transition"
                    >
                      Participate
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-400 col-span-full text-xl">
              No matching events found.
            </p>
          )}
        </div>

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
                  {selectedEvent?.interests?.length > 0
                    ? "Select Your Interest"
                    : "Confirm Participation"}
                </h3>

                {selectedEvent?.interests?.length > 0 ? (
                  <div className="grid grid-cols-2 gap-4">
                    {selectedEvent.interests.map((interest, index) => (
                      <div
                        key={index}
                        className={`p-4 rounded-lg cursor-pointer ${
                          selectedInterest === interest
                            ? "bg-green-600 scale-105"
                            : "bg-gray-700 hover:bg-gray-600"
                        }`}
                        onClick={() => setSelectedInterest(interest)}
                      >
                        <span className="text-lg font-medium text-white">
                          {interest.replace(/["[\]]/g, "")}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-400">
                    Click confirm to participate.
                  </p>
                )}

                <div className="mt-8 flex justify-between">
                  <button
                    onClick={() => setShowParticipationModal(false)}
                    className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmParticipation}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                  >
                    Confirm
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default EventsPage;
