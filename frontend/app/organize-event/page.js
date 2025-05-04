"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; // Import useRouter for redirection

const OrganizeEvent = () => {
  const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format
  const router = useRouter(); // Initialize the router for redirection

  const [formData, setFormData] = useState({
    title: "",
    date: "",
    time: "12:00",
    period: "AM",
    location: "",
    description: "",
    maxParticipants: "",
    banner: null,
    interests: "",
  });

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [createdEvent, setCreatedEvent] = useState(false); // Track if the event was successfully created

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === "file") {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setIsLoading(true);

    if (formData.date < today) {
      setError("Event date must be today or a future date.");
      setIsLoading(false);
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setError("You must be logged in to create an event.");
      setIsLoading(false);
      return;
    }

    const eventData = new FormData();
    eventData.append("title", formData.title);
    eventData.append("date", formData.date);
    eventData.append("time", formData.time);
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
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/events/create`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: eventData,
        }
      );

      const data = await response.json();
      if (response.ok) {
        setSuccessMessage("Event created successfully!");
        setCreatedEvent(true); // Set the created event flag to true
        setFormData({
          title: "",
          date: "",
          time: "12:00",
          period: "AM",
          location: "",
          description: "",
          maxParticipants: "",
          banner: null,
          interests: "",
        });

        // Redirect to the newly created event page after creation
        setTimeout(() => {
          router.push("/events"); // Assuming `eventId` is returned from the API
        }, 2000); // Redirect after 2 seconds
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
    <div
      className="min-h-screen flex flex-col justify-center items-center bg-gray-900 text-white px-6 pb-6"
      style={{
        backgroundImage: createdEvent
          ? "url('/images/celb.gif')" // Replace with your GIF URL
          : "none", // No background until the event is created
      }}
    >
      <h1 className="text-4xl font-extrabold text-blue-500 mb-6">
        Organize Event
      </h1>

      {error && <p className="text-red-500 text-center">{error}</p>}

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
          min={today} // Prevent past dates
          className="w-full p-4 bg-gray-900 border border-gray-800 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />

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
          required
        />

        {/* Success Message directly above the Create Event button */}
        {successMessage && (
          <p className="text-green-500 text-center mb-4">{successMessage}</p>
        )}

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
