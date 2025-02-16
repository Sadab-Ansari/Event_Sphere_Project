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
    console.log("Token:", token); // 🔹 Debugging log

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
      console.log("Sending event data...", eventData); // 🔹 Debugging log

      const response = await fetch("http://localhost:5000/api/events/create", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`, // ✅ Ensure token is sent
        },
        body: eventData, // Don't set Content-Type manually for FormData
      });

      const data = await response.json();
      console.log("Server Response:", data); // 🔹 Debugging log

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
      console.error("Event creation error:", error); // 🔹 Log actual error
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false); // 🔹 Stop loading
    }
  };

  return (
    <div
      className="min-h-screen flex justify-center items-center bg-cover bg-center p-6"
      style={{ backgroundImage: "url('/images/event2.avif')" }}
    >
      <div className="w-full max-w-2xl bg-transparent border border-white p-10 rounded-2xl shadow-lg backdrop-blur-lg">
        <h2 className="text-4xl font-bold text-white text-center mb-8">
          Organize Event
        </h2>

        {error && <p className="text-red-500 text-center">{error}</p>}
        {successMessage && (
          <p className="text-green-500 text-center">{successMessage}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            name="title"
            placeholder="Event Title"
            value={formData.title}
            onChange={handleChange}
            className="w-full p-4 bg-transparent border border-white text-white font-bold placeholder-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-white"
            required
          />
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full p-4 bg-transparent border border-white text-white placeholder-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-white"
            required
          />
          <input
            type="text"
            name="location"
            placeholder="Location"
            value={formData.location}
            onChange={handleChange}
            className="w-full p-4 bg-transparent border border-white text-white placeholder-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-white"
            required
          />
          <textarea
            name="description"
            placeholder="Event Description"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-4 bg-transparent border border-white text-white placeholder-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-white"
            required
          ></textarea>
          <input
            type="number"
            name="maxParticipants"
            placeholder="Max Participants"
            value={formData.maxParticipants}
            onChange={handleChange}
            className="w-full p-4 bg-transparent border border-white text-white placeholder-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-white"
            required
          />
          <input
            type="file"
            name="banner"
            accept="image/*"
            onChange={handleChange}
            className="w-full p-4 bg-transparent text-white cursor-pointer border border-white rounded-2xl"
          />
          <button
            type="submit"
            className={`w-full p-4 text-white rounded-2xl transition ${
              isLoading
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-800"
            }`}
            disabled={isLoading}
          >
            {isLoading ? "Creating..." : "Create Event"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default OrganizeEvent;
