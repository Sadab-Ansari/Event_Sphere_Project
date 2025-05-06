"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const EventStats = () => {
  const [stats, setStats] = useState({
    totalEvents: 0,
    participants: 0,
    organizers: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/stats`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch event stats");
        }

        const data = await response.json();
        setStats({
          totalEvents: data.events,
          participants: data.participants,
          organizers: data.organizers,
        });
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <section className="bg-gray-100 py-10">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-6">Loading...</h2>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="bg-gray-100 py-10">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-6">Error: {error}</h2>
        </div>
      </section>
    );
  }

  return (
    <motion.section
      className="bg-cover bg-center py-32"
      style={{ backgroundImage: `url('/images/event.webp')` }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      <div className="container mx-auto px-6 text-center">
        <motion.h2
          className="text-5xl font-bold mb-12 text-black"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Event Highlights
        </motion.h2>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            { label: "Events Hosted", value: stats.totalEvents },
            { label: "Participants", value: stats.participants },
            { label: "Organizers", value: stats.organizers },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              className="p-6 bg-gradient-to-br from-indigo-700 via-purple-600 to-pink-500 bg-opacity-100 rounded-lg shadow-md h-36 pt-6 transition-all duration-300"
              variants={cardVariants}
              transition={{ duration: 0.6, delay: index * 0.2 }}
            >
              <h3 className="text-4xl font-bold text-white">{stat.value}+</h3>
              <p className="text-white text-xl mt-2">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export default EventStats;
