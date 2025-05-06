"use client";
import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import Link from "next/link";

const TravelEventList = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/events/all`)
      .then((res) => res.json())
      .then((data) => {
        setEvents(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching events:", error);
        setLoading(false);
      });
  }, []);

  return (
    <section className="py-10 bg-gradient-to-br from-indigo-700 via-purple-600 to-pink-500">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-6 text-white drop-shadow-lg">
          Explore Upcoming Events
        </h2>

        {loading ? (
          <p className="text-center text-gray-400 text-xl">Loading events...</p>
        ) : events.length > 0 ? (
          <Swiper
            modules={[Autoplay, Navigation]}
            slidesPerView={1}
            spaceBetween={30}
            navigation
            autoplay={{ delay: 5000 }}
            loop
            className="rounded-2xl overflow-hidden"
          >
            {events.map((event) => (
              <SwiperSlide key={event._id}>
                <div className="relative h-[450px]">
                  {event.banner ? (
                    <img
                      src={`${process.env.NEXT_PUBLIC_API_URL}${event.banner}`}
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-600 flex items-center justify-center text-gray-400">
                      No Image Available
                    </div>
                  )}
                  <div className="absolute inset-0 flex flex-col justify-end p-6 text-white bg-black/40">
                    <h2 className="text-3xl font-bold mb-2 drop-shadow-xl">
                      {event.title}
                    </h2>
                    <p className="text-lg mb-2">
                      {new Date(event.date).toDateString()} at {event.time}
                    </p>
                    <p className="text-md mb-4">
                      <span className="font-medium">Location:</span>{" "}
                      {event.location}
                    </p>
                    <div className="flex gap-4">
                      <Link
                        href="/events"
                        className="inline-block bg-gradient-to-br from-indigo-700 via-purple-600 to-pink-500 text-white px-5 py-2 rounded-md transform transition-all duration-300 ease-in-out hover:scale-105 hover:from-yellow-400 hover:to-red-400 shadow-md hover:shadow-xl"
                      >
                        Explore more
                      </Link>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <p className="text-center text-gray-400 text-xl">
            No matching events found.
          </p>
        )}
      </div>
    </section>
  );
};

export default TravelEventList;
