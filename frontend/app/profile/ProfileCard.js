import { useState, useEffect } from "react";
import {
  FaEnvelope,
  FaPhone,
  FaUserEdit,
  FaTrash,
  FaEdit,
  FaCamera,
} from "react-icons/fa";
import ProfileEvent from "./ProfileEvent";

const ProfileCard = ({
  user,
  editMode,
  setUser,
  setEditMode,
  formData = { name: "", email: "", phone: "" },
  handleChange,
  handleSave,
  handleDeleteEvent,
  handleRemoveProfilePic, // ✅ Receive as prop from Profile.js
}) => {
  const [organizedEvents, setOrganizedEvents] = useState([]);
  const [participatedEvents, setParticipatedEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profilePic, setProfilePic] = useState(
    user?.profilePic
      ? `http://localhost:5000${user.profilePic}`
      : "/default-profile.jpg"
  );
  const [isEditingPhoto, setIsEditingPhoto] = useState(false);

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
          setUser((prevUser) => ({
            ...prevUser,
            profilePic: data.user.profilePic, // ✅ Now setUser is defined
          }));
        }
      } catch (error) {
        console.error("Error uploading profile picture:", error);
      }
    }
  };

  useEffect(() => {
    setProfilePic(
      user?.profilePic
        ? `http://localhost:5000${user.profilePic}`
        : "/default-profile.jpg"
    );
  }, [user?.profilePic]); // ✅ Update profile pic when user data changes

  // Handle Save with Reset
  const handleSaveWithReset = () => {
    handleSave();
    setIsEditingPhoto(false);
  };

  if (loading) return <p className="text-center">Loading profile...</p>;

  return (
    <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-lg text-center">
      <h2 className="text-3xl font-bold text-gray-800 mb-4">My Profile</h2>

      {/* Profile Picture */}
      {/* Profile Picture */}
      <div className="relative flex justify-center group">
        <div className="relative w-40 h-40">
          <img
            src={profilePic}
            alt="Profile"
            className="w-full h-full rounded-full border-4 border-cyan-600 shadow-lg group-hover:opacity-80 transition"
          />

          {/* Edit Icon (Camera) */}
          <button
            onClick={() => setIsEditingPhoto(!isEditingPhoto)}
            className="absolute bottom-1 right-1 bg-gray-700 text-white p-1.5 rounded-full cursor-pointer hover:bg-gray-800 transition"
          >
            <FaCamera className="text-lg" />
          </button>
        </div>

        {/* Add/Change/Remove Photo Options */}
        {isEditingPhoto && (
          <div className="absolute bottom-12 right-6 flex flex-col items-center space-y-2 bg-white p-3 rounded-lg shadow-md">
            {/* ✅ Show "Add Photo" only when there's no profile picture */}
            {!user?.profilePic || user.profilePic === "/default-profile.jpg" ? (
              <label
                htmlFor="profilePic"
                className="text-gray-700 hover:text-cyan-700 cursor-pointer flex items-center gap-2"
              >
                <FaUserEdit /> <span>Add Photo</span>
              </label>
            ) : (
              <>
                {/* ✅ Show "Change Photo" only when a profile picture exists */}
                <label
                  htmlFor="profilePic"
                  className="text-gray-700 hover:text-cyan-700 cursor-pointer flex items-center gap-2"
                >
                  <FaUserEdit /> <span>Change Photo</span>
                </label>

                {/* ✅ Show "Remove Photo" only when a profile picture exists */}
                <button
                  onClick={handleRemoveProfilePic}
                  className="text-red-600 hover:text-red-800 flex items-center gap-2"
                >
                  <FaTrash /> Remove
                </button>
              </>
            )}

            <input
              type="file"
              id="profilePic"
              className="hidden"
              onChange={handleProfilePicChange}
            />
          </div>
        )}
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
            onClick={handleSaveWithReset}
            className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition"
          >
            Save Changes
          </button>
        </div>
      ) : (
        <div className="text-center mt-6 space-y-3 text-lg font-bold">
          <p className="text-lg font-extrabold">{user?.name || "No Name"}</p>
          <p className="text-gray-600 flex justify-center items-center gap-2">
            <FaEnvelope /> {user?.email || "No Email"}
          </p>
          <p className="text-gray-600 flex justify-center items-center gap-2">
            <FaPhone /> {user?.phone || "No phone added"}
          </p>
          <button
            onClick={() => {
              setEditMode(true);
              setIsEditingPhoto(true);
            }}
            className="mt-4 bg-cyan-700 text-white px-4 py-2 rounded-md hover:bg-cyan-800 transition w-full"
          >
            Edit Profile
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileCard;
