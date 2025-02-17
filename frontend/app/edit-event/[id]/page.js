"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation"; // ✅ Use useParams() for dynamic routing

const EditEventPage = () => {
  const { id } = useParams(); // ✅ Correct way to get event ID from URL
  const router = useRouter();

  const [event, setEvent] = useState({
    title: "",
    date: "",
    location: "",
    description: "",
    banner: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) {
      console.log("ID is undefined, skipping fetch.");
      setError("Event ID is missing.");
      setLoading(false);
      return;
    }

    const fetchEvent = async () => {
      try {
        console.log("Fetching event with ID:", id);
        const response = await fetch(`http://localhost:5000/api/events/${id}`);
        if (!response.ok) {
          throw new Error(
            `API Error: ${response.status} ${response.statusText}`
          );
        }
        const data = await response.json();
        const formattedDate = new Date(data.date).toISOString().split("T")[0];
        setEvent({ ...data, date: formattedDate });
      } catch (err) {
        console.error("Error fetching event:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  const handleChange = (e) => {
    setEvent({ ...event, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!event.title || !event.date || !event.location || !event.description) {
      setError("All fields are required.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/events/update/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(event),
        }
      );

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || "Failed to update event");
      }

      console.log("Event updated successfully!");
      router.push(`/events/${id}`);
    } catch (err) {
      console.error("Error updating event:", err);
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-800 flex items-center justify-center">
        <p className="text-white text-xl">Loading event details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-800 flex items-center justify-center">
        <p className="text-red-500 text-xl">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-800 p-6">
      <h1 className="text-4xl font-bold text-center text-blue-400 mb-8">
        Edit Event
      </h1>

      <form
        onSubmit={handleSubmit}
        className="max-w-2xl mx-auto bg-gray-700 p-8 rounded-lg shadow-lg"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-2">
            <label className="block text-white font-medium">Event Title</label>
            <input
              type="text"
              name="title"
              value={event.title}
              onChange={handleChange}
              className="w-full p-3 border border-gray-600 rounded-lg bg-gray-800 text-white focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-white font-medium">Event Date</label>
            <input
              type="date"
              name="date"
              value={event.date}
              onChange={handleChange}
              className="w-full p-3 border border-gray-600 rounded-lg bg-gray-800 text-white focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        <div className="mb-6 space-y-2">
          <label className="block text-white font-medium">Event Location</label>
          <input
            type="text"
            name="location"
            value={event.location}
            onChange={handleChange}
            className="w-full p-3 border border-gray-600 rounded-lg bg-gray-800 text-white focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="mb-6 space-y-2">
          <label className="block text-white font-medium">
            Event Description
          </label>
          <textarea
            name="description"
            value={event.description}
            onChange={handleChange}
            className="w-full p-3 border border-gray-600 rounded-lg bg-gray-800 text-white focus:ring-2 focus:ring-blue-500"
            rows="5"
            required
          />
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-500/10 text-red-500 rounded-lg">
            {error}
          </div>
        )}

        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2 text-white bg-gray-600 hover:bg-gray-700 rounded-lg transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition"
          >
            Update Event
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditEventPage;
