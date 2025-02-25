"use client";
import { useState, useEffect } from "react";

const Clock = () => {
  const [time, setTime] = useState(new Date());
  const [is24Hour, setIs24Hour] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const toggleClockFormat = () => {
    setIs24Hour(!is24Hour);
  };

  const formatTime = (date, is24Hour) => {
    return is24Hour
      ? date.toLocaleTimeString("en-US", { hour12: false })
      : date.toLocaleTimeString("en-US", { hour12: true });
  };

  return (
    <div className="flex flex-col items-center justify-center bg-gray-900 text-white pt-5 rounded-full">
      {/* Clock Display */}
      <div className="text-5xl font-mono font-bold mb-8">
        {formatTime(time, is24Hour)}
      </div>

      {/* Clock Style Selector */}
      <div className="flex space-x-4 mb-8">
        <button
          onClick={toggleClockFormat}
          className={`px-6 py-2 rounded-lg ${
            !is24Hour ? "bg-blue-600" : "bg-gray-700"
          } text-white font-semibold`}
        >
          12H
        </button>
        <button
          onClick={toggleClockFormat}
          className={`px-6 py-2 rounded-lg ${
            is24Hour ? "bg-blue-600" : "bg-gray-700"
          } text-white font-semibold`}
        >
          24H
        </button>
      </div>
    </div>
  );
};

export default Clock;
