"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const Hero = () => {
  return (
    <section className="flex items-center justify-center bg-gradient-to-br from-indigo-700 via-purple-600 to-pink-500 py-16 px-4">
      <motion.div
        className="bg-white/10 backdrop-blur-md text-white text-center px-6 py-8 sm:px-8 sm:py-10 
                   rounded-2xl sm:rounded-l-full sm:rounded-r-full 
                   shadow-2xl w-full max-w-4xl"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <motion.h1
          className="text-2xl sm:text-3xl md:text-5xl font-extrabold mb-4 leading-tight"
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          Take Control of Your Campus Experience
        </motion.h1>

        <motion.p
          className="text-sm sm:text-base md:text-xl mb-6 text-white/90"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          Host events, join communities, and never miss what matters most.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <Link
            href="/events"
            className="bg-white text-purple-700 px-5 py-3 rounded-full font-semibold shadow-md hover:bg-gray-100 transition"
          >
            Browse Events
          </Link>
          <Link
            href="/login"
            className="bg-white/20 backdrop-blur border border-white text-white px-5 py-3 rounded-full font-semibold hover:bg-white/30 transition"
          >
            Get Started
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
