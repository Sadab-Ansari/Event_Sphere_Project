import { FaEdit, FaTrash } from "react-icons/fa";

const ProfileEvent = ({ events = [], type, handleDeleteEvent }) => {
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
                  <button className="text-blue-600 hover:text-blue-800">
                    <FaEdit />
                  </button>
                  <button
                    className="text-red-600 hover:text-red-800"
                    onClick={() => handleDeleteEvent(event._id)}
                  >
                    <FaTrash />
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
