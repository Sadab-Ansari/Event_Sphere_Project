"use client";

import { useState } from "react";

const Register = () => {
  const [formData, setFormData] = useState({ name: "", email: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Registration successful! (Backend will be integrated later)");
  };

  return (
    <div className="container mx-auto px-6 py-10">
      <h2 className="text-3xl font-bold text-center">Register for Event</h2>
      <form
        onSubmit={handleSubmit}
        className="max-w-md mx-auto mt-6 bg-white p-6 rounded-lg shadow-md"
      >
        <div className="mb-4">
          <label className="block text-gray-700">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700"
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
