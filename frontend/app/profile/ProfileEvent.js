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
    <div className="mt-8 text-left">
      <h3 className="text-xl font-bold text-gray-800 mb-3">
        {type === "organized" ? "Organized Events" : "Participated Events"}
      </h3>
      {events.length > 0 ? (
        <ul className="space-y-2">
          {events.map((event) => (
            <li
              key={event._id}
              className="p-3 bg-gray-100 rounded-md shadow flex justify-between items-center"
            >
              <div>
                <p className="font-semibold">{event.title}</p>
                <p className="text-gray-600">
                  {new Date(event.date).toDateString()}
                </p>
              </div>
              {type === "organized" && (
                <div className="flex gap-2">
                  <Link
                    href={`/edit-event/${event._id}`}
                    className="bg-yellow-600 text-white px-4 py-2 rounded-md hover:bg-yellow-700 transition flex items-center gap-2"
                  >
                    <FaEdit className="text-white text-2xl" />
                    <span>Edit</span>
                  </Link>
                  <button
                    className="text-red-600 hover:text-red-800"
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
                    <FaTrash className="text-red-600 text-2xl" />
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">No {type} events found.</p>
      )}
    </div>
  );
};

export default ProfileEvent;
