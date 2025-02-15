"use client";

import Link from "next/link";

const Hero = () => {
  return (
    <section className="bg-green-700 text-white text-center py-20">
      <div className="container mx-auto px-6">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          Organize & Manage College Events Easily
        </h1>
        <p className="text-lg md:text-xl mb-6">
          Discover, create, and participate in amazing events at your college.
        </p>
        <div className="space-x-4">
          <Link
            href="/events"
            className="bg-white text-cyan-700 px-6 py-3 rounded-md font-semibold hover:bg-gray-200"
          >
            Browse Events
          </Link>
          <Link
            href="/register"
            className="bg-gray-200 text-cyan-700 px-6 py-3 rounded-md font-semibold hover:bg-gray-300"
          >
            Get Started
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;
