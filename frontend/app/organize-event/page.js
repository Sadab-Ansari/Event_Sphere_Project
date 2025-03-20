"use client";

import { useState } from "react";

const OrganizeEvent = () => {
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    time: "12:00", // Set a default time to avoid uncontrolled input
    period: "AM", // AM/PM selection
    location: "",
    description: "",
    maxParticipants: "",
    banner: null,
    interests: "",
  });

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === "file") {
      setFormData({ ...formData, [name]: files[0] }); // Store file correctly
    } else if (name === "time") {
      let [hours, minutes] = value.split(":");
      if (formData.period === "PM" && hours !== "12") {
        hours = String(parseInt(hours) + 12);
      } else if (formData.period === "AM" && hours === "12") {
        hours = "00";
      }
      setFormData({ ...formData, time: `${hours}:${minutes}` });
    } else if (name === "period") {
      setFormData({ ...formData, period: value });
    } else {
      setFormData({ ...formData, [name]: value });
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

    // Format the time before submission
    let [hours, minutes] = formData.time.split(":");
    if (formData.period === "PM" && hours !== "12") {
      hours = String(parseInt(hours) + 12);
    } else if (formData.period === "AM" && hours === "12") {
      hours = "00";
    }
    const formattedTime = `${hours}:${minutes}`;

    const eventData = new FormData();
    eventData.append("title", formData.title);
    eventData.append("date", formData.date);
    eventData.append("time", formattedTime); // Send converted time
    eventData.append("location", formData.location);
    eventData.append("description", formData.description);
    eventData.append("maxParticipants", formData.maxParticipants);
    if (formData.banner) {
      eventData.append("banner", formData.banner);
    }

    const formattedInterests = formData.interests
      .split(",")
      .map((i) => i.trim())
      .filter((i) => i !== "");
    eventData.append("interests", JSON.stringify(formattedInterests));

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
          time: "12:00", // Reset to default time
          period: "AM",
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

        {/* Time Input with AM/PM Selection */}
        <div className="flex space-x-2">
          <input
            type="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            className="w-full p-4 bg-gray-900 border border-gray-800 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            name="period"
            value={formData.period}
            onChange={handleChange}
            className="p-4 bg-gray-900 border border-gray-800 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="AM">AM</option>
            <option value="PM">PM</option>
          </select>
        </div>

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
