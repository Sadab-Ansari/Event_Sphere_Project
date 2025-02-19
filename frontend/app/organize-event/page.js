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
    interests: "", // Kept as a string for input handling
  });

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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
    setIsLoading(true);

    const token = localStorage.getItem("token");
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
    if (formData.banner) {
      eventData.append("banner", formData.banner);
    }

    // ✅ Convert interests to an array before sending
    eventData.append(
      "interests",
      JSON.stringify(formData.interests.split(",").map((i) => i.trim()))
    );

    try {
      const response = await fetch("http://localhost:5000/api/events/create", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: eventData,
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
          interests: "",
        });
      } else {
        setError(data.message || "Failed to create event");
      }
    } catch (error) {
      console.error("Event creation error:", error);
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-900 text-white px-6">
      <h1 className="text-4xl font-extrabold text-blue-500 mb-6">
        Organize Event
      </h1>

      {error && <p className="text-red-500 text-center">{error}</p>}
      {successMessage && (
        <p className="text-green-500 text-center">{successMessage}</p>
      )}

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
          type="text"
          name="interests"
          placeholder="Enter interests (comma-separated)"
          value={formData.interests}
          onChange={handleChange}
          className="w-full p-4 bg-gray-800 border border-gray-700 text-white rounded-xl"
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
