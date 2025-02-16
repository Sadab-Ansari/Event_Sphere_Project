"use client";

import { useState, useEffect } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import ProfileCard from "./ProfileCard";

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

  if (loading) {
    return (
      <ProtectedRoute>
        <p className="text-center mt-20 text-xl font-semibold">Loading...</p>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-500 to-cyan-500 p-6">
        <ProfileCard
          user={user}
          editMode={editMode}
          setEditMode={setEditMode}
          formData={formData}
          handleChange={handleChange}
          handleSave={handleSave}
          organizedEvents={organizedEvents}
          participatedEvents={participatedEvents}
          handleDeleteEvent={handleDeleteEvent}
        />
      </div>
    </ProtectedRoute>
  );
};

export default Profile;
