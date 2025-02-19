import { useRouter } from "next/navigation";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useEffect, useState } from "react";
import Link from "next/link";

const ProfileEvent = ({ events = [], type, handleDeleteEvent }) => {
  const [isClient, setIsClient] = useState(false); // Track if it's the client-side render
  const router = useRouter(); // Initialize the useRouter hook from next/navigation

  useEffect(() => {
    setIsClient(true); // Set to true once component is mounted on client side
  }, []);

  // Prevent usage of `useRouter` until component is mounted
  if (!isClient) return null;

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

              {type === "organized" && (
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
                </div>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-400 text-lg">No {type} events found.</p>
      )}
    </div>
  );
};

export default ProfileEvent;
