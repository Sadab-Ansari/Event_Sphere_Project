import { useState, useEffect } from "react";

const UpcomingEvent = () => {
  const [nearestEvent, setNearestEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNearestEvent = async () => {
      try {
        // Fetch all events where the user is a participant
        const res = await fetch("http://localhost:5000/api/events/upcoming", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        if (!res.ok) {
          throw new Error("Failed to fetch events");
        }
        const events = await res.json();

        // Get the logged-in user's ID from the token
        const token = localStorage.getItem("token");
        const decodedToken = JSON.parse(atob(token.split(".")[1])); // Decode the token
        const userId = decodedToken.userId; // Assuming the user ID is stored in `userId`

        // Filter events where the user is a participant
        const userEvents = events.filter((event) =>
          event.participants.some(
            (participant) => participant.user.toString() === userId
          )
        );

        // Sort events by date to find the nearest one
        const sortedEvents = userEvents.sort(
          (a, b) => new Date(a.date) - new Date(b.date)
        );

        // Set the nearest event
        setNearestEvent(sortedEvents[0]);
      } catch (error) {
        console.error("Error fetching nearest event:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNearestEvent();
  }, []);

  if (loading) {
    return <p className="text-center">Loading upcoming event...</p>;
  }

  if (!nearestEvent) {
    return <p className="text-center">No upcoming events found.</p>;
  }

  return (
    <div className="bg-gray-300 rounded-lg shadow-lg overflow-hidden">
      {/* Event Banner */}
      <div className="relative">
        {nearestEvent.banner ? (
          <img
            src={`http://localhost:5000${nearestEvent.banner}`}
            alt={nearestEvent.title}
            className="w-full h-48 object-cover"
          />
        ) : (
          <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-500">
            No Banner Available
          </div>
        )}
      </div>

      {/* Event Title and Time */}
      <div className="p-4">
        <h3 className="text-xl font-semibold">{nearestEvent.title}</h3>
        <p className="text-sm text-gray-600">{nearestEvent.time}</p>
      </div>
    </div>
  );
};

export default UpcomingEvent;
