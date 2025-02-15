import { useState, useEffect } from "react";
import { FaEnvelope, FaPhone, FaUserEdit } from "react-icons/fa";

const ProfileCard = ({
  user = {}, // Default to an empty object to avoid `null` errors
  editMode,
  setEditMode,
  formData,
  handleChange,
  handleSave,
}) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    fetch("http://localhost:5000/api/user/profile/events", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setEvents(data);
        setLoading(false); // Stop loading after fetching data
      })
      .catch((err) => {
        console.error("Error fetching events:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="text-center">Loading profile...</p>; // Show loading state

  return (
    <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md text-center">
      <h2 className="text-3xl font-bold text-gray-800 mb-4">My Profile</h2>
      <div className="relative flex justify-center">
        <img
          src={user?.profilePic || "/default-profile.jpg"}
          alt="Profile"
          className="w-28 h-28 rounded-full border-4 border-cyan-600 shadow-lg"
        />
        <label
          htmlFor="profilePic"
          className="absolute bottom-0 right-10 bg-gray-700 text-white p-2 rounded-full cursor-pointer"
        >
          <FaUserEdit />
        </label>
        <input type="file" id="profilePic" className="hidden" />
      </div>

      {editMode ? (
        <div className="mt-6">
          <input
            type="text"
            name="name"
            value={formData?.name || ""}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md mb-2"
            placeholder="Name"
          />
          <input
            type="email"
            name="email"
            value={formData?.email || ""}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md mb-2"
            placeholder="Email"
          />
          <input
            type="text"
            name="phone"
            value={formData?.phone || ""}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md mb-4"
            placeholder="Phone"
          />
          <button
            onClick={handleSave}
            className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition"
          >
            Save Changes
          </button>
        </div>
      ) : (
        <div className="text-center mt-6 space-y-3">
          <p className="text-lg font-semibold">{user?.name || "No Name"}</p>
          <p className="text-gray-600 flex justify-center items-center gap-2">
            <FaEnvelope /> {user?.email || "No Email"}
          </p>
          <p className="text-gray-600 flex justify-center items-center gap-2">
            <FaPhone /> {user?.phone || "No phone added"}
          </p>
          <button
            onClick={() => setEditMode(true)}
            className="mt-4 bg-cyan-700 text-white px-4 py-2 rounded-md hover:bg-cyan-800 transition w-full"
          >
            Edit Profile
          </button>
        </div>
      )}

      {/* ✅ My Events Section */}
      <div className="mt-8 text-left">
        <h3 className="text-xl font-bold text-gray-800 mb-3">My Events</h3>
        {events.length > 0 ? (
          <ul className="space-y-2">
            {events.map((event) => (
              <li key={event._id} className="p-3 bg-gray-100 rounded-md shadow">
                <p className="font-semibold">{event.title}</p>
                <p className="text-gray-600">
                  {new Date(event.date).toDateString()}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No past events found.</p>
        )}
      </div>
    </div>
  );
};

export default ProfileCard;
