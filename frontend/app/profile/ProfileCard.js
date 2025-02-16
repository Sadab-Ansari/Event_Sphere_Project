import { useState, useEffect } from "react";
import {
  FaEnvelope,
  FaPhone,
  FaUserEdit,
  FaTrash,
  FaEdit,
} from "react-icons/fa";

const ProfileCard = ({
  user,
  editMode,
  setEditMode,
  formData,
  handleChange,
  handleSave,
  handleDeleteEvent, // Function to delete event
}) => {
  const [organizedEvents, setOrganizedEvents] = useState([]);
  const [participatedEvents, setParticipatedEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profilePic, setProfilePic] = useState(
    user?.profilePic
      ? `http://localhost:5000${user.profilePic}`
      : "/default-profile.jpg"
  );

  // Fetch Events
  useEffect(() => {
    fetch("http://localhost:5000/api/user/profile/events", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setOrganizedEvents(data.organizedEvents || []);
        setParticipatedEvents(data.participatedEvents || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching events:", err);
        setLoading(false);
      });
  }, []);

  // Handle Profile Picture Upload
  const handleProfilePicChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("profilePic", file);

      try {
        const response = await fetch("http://localhost:5000/api/user/profile", {
          method: "PUT",
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          body: formData,
        });

        const data = await response.json();
        if (response.ok) {
          setProfilePic(`http://localhost:5000${data.user.profilePic}`);
        }
      } catch (error) {
        console.error("Error uploading profile picture:", error);
      }
    }
  };

  // Handle Profile Picture Removal
  const handleRemoveProfilePic = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/user/profile/remove-photo",
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      const data = await response.json();
      if (response.ok) {
        setProfilePic("/default-profile.jpg");
      }
    } catch (error) {
      console.error("Error removing profile picture:", error);
    }
  };

  if (loading) return <p className="text-center">Loading profile...</p>;

  return (
    <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md text-center">
      <h2 className="text-3xl font-bold text-gray-800 mb-4">My Profile</h2>

      {/* Profile Picture */}
      <div className="relative flex justify-center">
        <img
          src={profilePic}
          alt="Profile"
          className="w-28 h-28 rounded-full border-4 border-cyan-600 shadow-lg"
        />

        {/* Edit Profile Picture */}
        <div className="absolute bottom-0 right-10 flex flex-col items-center">
          <label
            htmlFor="profilePic"
            className="bg-gray-700 text-white p-2 rounded-full cursor-pointer flex items-center gap-2"
          >
            <FaUserEdit />
            <span> Edit Photo</span>
          </label>
          <input
            type="file"
            id="profilePic"
            className="hidden"
            onChange={handleProfilePicChange}
          />

          {/* Remove Profile Picture */}
          {user?.profilePic && (
            <button
              onClick={handleRemoveProfilePic}
              className="mt-2 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-800 transition"
            >
              Remove Photo
            </button>
          )}
        </div>
      </div>

      {/* Editable Form */}
      {editMode ? (
        <div className="mt-6">
          <input
            type="text"
            name="name"
            value={formData.name || ""}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md mb-2"
            placeholder="Name"
          />
          <input
            type="email"
            name="email"
            value={formData.email || ""}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md mb-2"
            placeholder="Email"
          />
          <input
            type="text"
            name="phone"
            value={formData.phone || ""}
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

      {/* Organized Events */}
      <div className="mt-8 text-left">
        <h3 className="text-xl font-bold text-gray-800 mb-3">
          Organized Events
        </h3>
        {organizedEvents.length > 0 ? (
          <ul className="space-y-2">
            {organizedEvents.map((event) => (
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
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No organized events found.</p>
        )}
      </div>

      {/* Participated Events */}
      <div className="mt-8 text-left">
        <h3 className="text-xl font-bold text-gray-800 mb-3">
          Participated Events
        </h3>
        {participatedEvents.length > 0 ? (
          <ul className="space-y-2">
            {participatedEvents.map((event) => (
              <li key={event._id} className="p-3 bg-gray-100 rounded-md shadow">
                <p className="font-semibold">{event.title}</p>
                <p className="text-gray-600">
                  {new Date(event.date).toDateString()}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No participated events found.</p>
        )}
      </div>
    </div>
  );
};

export default ProfileCard;
