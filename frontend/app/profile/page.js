"use client";

import { useState, useEffect } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import ProfileCard from "./ProfileCard";
import ProfileEvent from "./ProfileEvent";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [organizedEvents, setOrganizedEvents] = useState([]);
  const [participatedEvents, setParticipatedEvents] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/user/profile", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          setUser(data.user);
          setFormData(data.user);
          setOrganizedEvents(data.organizedEvents || []);
          setParticipatedEvents(data.participatedEvents || []);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching profile:", err);
        setLoading(false);
      });
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    fetch("http://localhost:5000/api/user/profile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(formData),
    })
      .then((res) => res.json())
      .then((data) => {
        setUser(data.user);
        setEditMode(false);
      })
      .catch((err) => console.error("Error updating profile:", err));
  };

  const handleRemoveProfilePic = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/user/profile/remove-picture",
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        setUser((prevUser) => ({
          ...prevUser,
          profilePic: "",
        }));
      } else {
        console.error("Error:", data.message);
      }
    } catch (error) {
      console.error("Error removing profile picture:", error);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/events/delete/${eventId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.ok) {
        setOrganizedEvents(
          organizedEvents.filter((event) => event._id !== eventId)
        );
      }
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  // ✅ Withdraw from Event Function
  const handleWithdraw = async (eventId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/events/withdraw/${eventId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.ok) {
        setParticipatedEvents(
          participatedEvents.filter((event) => event._id !== eventId)
        );
      }
    } catch (error) {
      console.error("Error withdrawing from event:", error);
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <p className="text-center mt-20 text-xl font-semibold">Loading...</p>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="flex flex-col items-center min-h-screen bg-gradient-to-r from-blue-500 to-cyan-500 p-6">
        {/* Profile Card */}
        <ProfileCard
          user={user}
          setUser={setUser}
          editMode={editMode}
          setEditMode={setEditMode}
          formData={formData}
          handleChange={handleChange}
          handleSave={handleSave}
          handleRemoveProfilePic={handleRemoveProfilePic}
        />

        {/* Organized Events Section */}
        {organizedEvents.length > 0 && (
          <ProfileEvent
            events={organizedEvents}
            type="organized"
            handleDeleteEvent={handleDeleteEvent}
          />
        )}

        {/* Participated Events Section */}
        {participatedEvents.length > 0 && (
          <ProfileEvent
            events={participatedEvents}
            type="participated"
            handleWithdraw={handleWithdraw} // ✅ Pass handleWithdraw to ProfileEvent
          />
        )}
      </div>
    </ProtectedRoute>
  );
};

export default Profile;
