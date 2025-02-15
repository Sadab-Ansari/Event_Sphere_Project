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

  const handleChange = (e) => {
    if (e.target.name === "banner") {
      setFormData({ ...formData, banner: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Event Data:", formData);
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
            className="w-full p-4 bg-blue-600 text-white rounded-2xl hover:bg-blue-800 transition"
          >
            Create Event
          </button>
        </form>
      </div>
    </div>
  );
};

export default OrganizeEvent;
