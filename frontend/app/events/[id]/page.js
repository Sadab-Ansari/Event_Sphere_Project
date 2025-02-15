"use client";

import { useParams } from "next/navigation";
import Link from "next/link";

const eventData = [
  {
    id: 1,
    title: "Tech Fest 2024",
    date: "March 15, 2024",
    location: "College Auditorium",
    description:
      "A grand festival showcasing the latest in technology and innovation.",
  },
  {
    id: 2,
    title: "Cultural Night",
    date: "April 5, 2024",
    location: "Open Ground",
    description:
      "An evening filled with music, dance, and cultural performances.",
  },
  {
    id: 3,
    title: "Hackathon 2024",
    date: "May 10, 2024",
    location: "Computer Lab",
    description: "Compete in coding challenges and win exciting prizes.",
  },
];

const EventDetails = () => {
  const params = useParams();
  const event = eventData.find((e) => e.id.toString() === params.id);

  if (!event) {
    return (
      <div className="text-center text-red-500 text-xl mt-10">
        Event Not Found
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-10">
      <h1 className="text-4xl font-bold text-cyan-700">{event.title}</h1>
      <p className="text-gray-600 mt-2">
        {event.date} | {event.location}
      </p>
      <p className="text-lg mt-4">{event.description}</p>

      {/* Register Button */}
      <Link
        href="/register"
        className="mt-6 inline-block bg-green-600 text-white px-6 py-3 rounded-md font-semibold hover:bg-green-700"
      >
        Register for Event
      </Link>

      <Link
        href="/events"
        className="mt-6 ml-4 inline-block bg-cyan-700 text-white px-4 py-2 rounded-md hover:bg-cyan-800"
      >
        Back to Events
      </Link>
    </div>
  );
};

export default EventDetails;
