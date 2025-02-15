"use client";

import { useState, useEffect } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import ProfileCard from "./ProfileCard";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    fetch("http://localhost:5000/api/user/profile", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          setUser(data);
          setFormData(data);
        }
      })
      .catch((err) => console.error("Error fetching profile:", err));
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

  if (!user) {
    return (
      <ProtectedRoute>
        <p className="text-center mt-20 text-xl font-semibold">Loading...</p>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="flex justify-center items-center min-h-[calc(100vh-4rem)] bg-gradient-to-r from-blue-500 to-cyan-500 p-6">
        <ProfileCard
          user={user}
          editMode={editMode}
          setEditMode={setEditMode}
          formData={formData}
          handleChange={handleChange}
          handleSave={handleSave}
        />
      </div>
    </ProtectedRoute>
  );
};

export default Profile;
