"use client";

import { useState } from "react";

const OrganizeEvent = () => {
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    location: "",
    description: "",
    maxParticipants: "",
    banner: null,
  });

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false); // 🔹 Loading state

  const handleChange = (e) => {
    if (e.target.name === "banner") {
      setFormData({ ...formData, banner: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setIsLoading(true); // 🔹 Start loading

    const token = localStorage.getItem("token"); // Get token from localStorage
    if (!token) {
      setError("You must be logged in to create an event.");
      setIsLoading(false);
      return;
    }

    const eventData = new FormData();
    eventData.append("title", formData.title);
    eventData.append("date", formData.date);
    eventData.append("location", formData.location);
    eventData.append("description", formData.description);
    eventData.append("maxParticipants", formData.maxParticipants);
    eventData.append("banner", formData.banner); // Ensure file is included

    try {
      const response = await fetch("http://localhost:5000/api/events/create", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }, // ✅ Ensure token is sent
        body: eventData, // Don't set Content-Type manually for FormData
      });

      const data = await response.json();
      if (response.ok) {
        setSuccessMessage("Event created successfully!");
        setFormData({
          title: "",
          date: "",
          location: "",
          description: "",
          maxParticipants: "",
          banner: null,
        });
      } else {
        setError(data.message || "Failed to create event");
      }
    } catch (error) {
      console.error("Event creation error:", error);
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false); // 🔹 Stop loading
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-900 text-white px-6">
      <h1 className="text-4xl font-extrabold text-blue-500 mb-6">
        Organize Event
      </h1>

      {/* Error & Success Messages */}
      {error && <p className="text-red-500 text-center">{error}</p>}
      {successMessage && (
        <p className="text-green-500 text-center">{successMessage}</p>
      )}

      {/* Organize Event Form */}
      <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-md">
        <input
          type="text"
          name="title"
          placeholder="Event Title"
          value={formData.title}
          onChange={handleChange}
          className="w-full p-4 bg-gray-900 border border-gray-800 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          className="w-full p-4 bg-gray-900 border border-gray-800 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={formData.location}
          onChange={handleChange}
          className="w-full p-4 bg-gray-900 border border-gray-800 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <textarea
          name="description"
          placeholder="Event Description"
          value={formData.description}
          onChange={handleChange}
          className="w-full p-4 bg-gray-900 border border-gray-800 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        ></textarea>
        <input
          type="number"
          name="maxParticipants"
          placeholder="Max Participants"
          value={formData.maxParticipants}
          onChange={handleChange}
          className="w-full p-4 bg-gray-900 border border-gray-800 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <input
          type="file"
          name="banner"
          accept="image/*"
          onChange={handleChange}
          className="w-full p-4 bg-gray-900 border border-gray-800 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className={`w-full p-4 text-white rounded-xl transition ${
            isLoading
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
          disabled={isLoading}
        >
          {isLoading ? "Creating..." : "Create Event"}
        </button>
      </form>
    </div>
  );
};

export default OrganizeEvent;
