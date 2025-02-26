"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion"; // Import Framer Motion

const Clock = () => {
  const [time, setTime] = useState("");
  const [is24Hour, setIs24Hour] = useState(true);
  const [meridian, setMeridian] = useState(""); // Store AM/PM separately

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const formattedTime = formatTime(now, is24Hour);
      setTime(formattedTime.time);
      setMeridian(formattedTime.meridian); // Set AM/PM separately
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, [is24Hour]);

  const formatTime = (date, is24Hour) => {
    const options = { hour12: !is24Hour };
    let timeString = date.toLocaleTimeString("en-US", options);

    if (!is24Hour) {
      const [timePart, meridian] = timeString.split(" ");
      return { time: timePart, meridian };
    }

    return { time: timeString, meridian: "" };
  };

  const [hour, minute, second] = time.split(":") || ["00", "00", "00"];

  return (
    <div className="flex flex-col items-center justify-center bg-white text-black pt-5 rounded-lg shadow-xl h-48">
      {/* Clock Display */}
      <div className="text-5xl font-mono font-bold mb-8 flex items-center space-x-1">
        <span className="text-red-500 tracking-tight">{hour}</span>
        <span className="text-black tracking-tight">
          :{minute}:{second}
        </span>
        {!is24Hour && (
          <span className="text-yellow-400 ml-2 text-3xl">{meridian}</span>
        )}
      </div>

      {/* Toggle Clock Format with Underline Animation */}
      <div className="relative flex space-x-10 mb-8 text-lg font-semibold">
        <button onClick={() => setIs24Hour(false)} className="relative">
          12H
          {!is24Hour && (
            <motion.div
              layoutId="underline"
              className="absolute left-0 bottom-[-5px] w-full h-1 bg-blue-600 rounded-full"
            />
          )}
        </button>

        <button onClick={() => setIs24Hour(true)} className="relative">
          24H
          {is24Hour && (
            <motion.div
              layoutId="underline"
              className="absolute left-0 bottom-[-5px] w-full h-1 bg-blue-600 rounded-full"
            />
          )}
        </button>
      </div>
    </div>
  );
};

export default Clock;
