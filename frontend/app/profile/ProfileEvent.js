"use client";
import { useRouter } from "next/navigation";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useEffect, useState } from "react";
import Link from "next/link";

const ProfileEvent = ({
  events = [],
  type,
  handleDeleteEvent,
  handleWithdraw,
  handleRemoveParticipant,
}) => {
  const [isClient, setIsClient] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [participantsCache, setParticipantsCache] = useState({});
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  const fetchParticipants = async (event) => {
    if (participantsCache[event._id]) {
      setSelectedEvent(participantsCache[event._id]);
      return;
    }
    try {
      const res = await fetch(`http://localhost:5000/api/events/${event._id}`);
      const data = await res.json();
      if (res.ok) {
        setSelectedEvent(data);
        setParticipantsCache((prev) => ({ ...prev, [event._id]: data }));
      }
    } catch (error) {
      console.error("Error fetching participants:", error);
    }
  };

  return (
    <div className="mt-8 text-left max-w-lg w-full">
      <h3 className="text-2xl font-bold text-blue-400 mb-4">
        {type === "organized" ? "Organized Events" : "Participated Events"}
      </h3>

      {events.length > 0 ? (
        <ul className="space-y-4">
          {events.map((event) => (
            <li
              key={event._id}
              className="p-4 bg-gray-800 rounded-lg flex justify-between"
            >
              <div>
                <p className="text-white font-semibold text-lg">
                  {event.title}
                </p>
                <p className="text-gray-300">
                  {new Date(event.date).toDateString()} at {event.time}
                </p>
              </div>

              {type === "organized" ? (
                <div className="flex gap-3">
                  <Link
                    href={`/edit-event/${event._id}`}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                  >
                    <FaEdit className="text-white" />
                    Edit
                  </Link>
                  <button
                    className="bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                    onClick={() => {
                      if (
                        window.confirm(
                          "Are you sure you want to delte this event this event?"
                        )
                      ) {
                        handleDeleteEvent(event._id);
                      }
                    }}
                  >
                    <FaTrash className="text-white" />
                    Delete
                  </button>
                  <button
                    className="bg-green-600 text-white px-4 py-2 rounded-lg"
                    onClick={() => fetchParticipants(event)}
                  >
                    View Participants
                  </button>
                </div>
              ) : (
                <button
                  className="bg-yellow-500 text-white px-4 py-2 rounded-lg"
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
        <p className="text-gray-400">No {type} events found.</p>
      )}

      {selectedEvent && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-gray-900 p-6 rounded-lg w-[600px] max-w-full">
            <h2 className="text-xl font-bold text-white text-center mb-4">
              Participants for {selectedEvent.title}
            </h2>

            {selectedEvent.participants.length > 0 ? (
              <ul className="space-y-2 h-[60vh] overflow-y-auto">
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
                        className="bg-red-500 text-white px-3 py-1 rounded-md"
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
              <p className="text-gray-400 text-center">No participants yet.</p>
            )}

            <button
              className="mt-4 w-full bg-gray-600 text-white py-2 rounded-lg"
              onClick={() => setSelectedEvent(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileEvent;
