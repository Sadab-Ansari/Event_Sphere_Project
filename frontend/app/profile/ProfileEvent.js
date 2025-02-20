import { useRouter } from "next/navigation";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const ProfileEvent = ({
  events = [],
  type,
  handleDeleteEvent,
  handleWithdraw,
  handleRemoveParticipant,
}) => {
  const [isClient, setIsClient] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [loadingParticipants, setLoadingParticipants] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  const fetchParticipants = async (event) => {
    setLoadingParticipants(true);
    try {
      const res = await fetch(`http://localhost:5000/api/events/${event._id}`);
      const data = await res.json();
      if (res.ok) {
        setSelectedEvent(data);
      } else {
        console.error("Error fetching participants:", data.error);
      }
    } catch (error) {
      console.error("Error fetching participants:", error);
    } finally {
      setLoadingParticipants(false);
    }
  };

  return (
    <div className="mt-8 text-left max-w-lg w-full">
      <h3 className="text-2xl font-bold text-gray-200 mb-4">
        {type === "organized" ? "Organized Events" : "Participated Events"}
      </h3>

      {events.length > 0 ? (
        <ul className="space-y-4">
          {events.map((event) => (
            <li
              key={event._id}
              className="p-4 bg-gray-800 rounded-lg shadow-lg flex justify-between items-center"
            >
              <div>
                <p className="text-white font-semibold text-lg">
                  {event.title}
                </p>
                <p className="text-gray-400 text-sm">
                  {new Date(event.date).toDateString()}
                </p>
              </div>

              {type === "organized" ? (
                <div className="flex gap-3">
                  <Link
                    href={`/edit-event/${event._id}`}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
                  >
                    <FaEdit className="text-white text-xl" />
                    <span>Edit</span>
                  </Link>

                  <button
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
                    onClick={() => {
                      if (
                        window.confirm(
                          "Are you sure you want to delete this event?"
                        )
                      ) {
                        handleDeleteEvent(event._id);
                      }
                    }}
                  >
                    <FaTrash className="text-white text-xl" />
                    <span>Delete</span>
                  </button>
                  <button
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition"
                    onClick={() => fetchParticipants(event)}
                  >
                    View Participants
                  </button>
                </div>
              ) : (
                <button
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg transition"
                  onClick={() => {
                    if (
                      window.confirm(
                        "Are you sure you want to withdraw from this event?"
                      )
                    ) {
                      handleWithdraw(event._id);
                    }
                  }}
                >
                  Withdraw
                </button>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-400 text-lg">No {type} events found.</p>
      )}

      <AnimatePresence>
        {selectedEvent && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4 z-50"
          >
            <div className="bg-gray-900 p-6 rounded-lg shadow-lg w-[600px] max-w-full">
              <h2 className="text-xl font-bold text-white text-center mb-4">
                Participants for {selectedEvent.title}
              </h2>

              {loadingParticipants ? (
                <p className="text-center text-gray-400">Loading...</p>
              ) : selectedEvent.participants.length > 0 ? (
                <ul className="space-y-2 h-[60vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
                  {selectedEvent.participants.map((participant, index) => (
                    <li
                      key={participant.user?._id || index}
                      className="p-3 bg-gray-700 rounded-md flex justify-between items-center"
                    >
                      <div className="text-white">
                        <p className="font-semibold">
                          {participant.user?.name || "N/A"}
                        </p>
                        <p className="text-sm text-gray-300">
                          📧 {participant.user?.email || "N/A"}
                        </p>
                        <p className="text-sm text-gray-300">
                          📞 {participant.user?.phone || "N/A"}
                        </p>
                      </div>
                      {handleRemoveParticipant && (
                        <button
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md transition-colors duration-200"
                          onClick={() =>
                            handleRemoveParticipant(
                              selectedEvent._id,
                              participant.user?._id
                            )
                          }
                        >
                          Remove
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-400 text-center">
                  No participants yet.
                </p>
              )}
              <button
                className="mt-4 w-full bg-gray-600 hover:bg-gray-700 text-white py-2 rounded-lg"
                onClick={() => setSelectedEvent(null)}
              >
                Close
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProfileEvent;
