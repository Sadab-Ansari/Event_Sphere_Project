"use client";

import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const TrafficBarChart = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTraffic = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/traffic/data");
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        if (!Array.isArray(result)) {
          throw new Error("Invalid data format received");
        }

        const formattedData = [
          { name: "Sun", traffic: 10 },
          { name: "Mon", traffic: 90 },
          { name: "Tue", traffic: 50 },
          { name: "Wed", traffic: 50 },
          { name: "Thu", traffic: 70 },
          { name: "Fri", traffic: 45 },
          { name: "Sat", traffic: 25 },
        ];

        result.forEach((item) => {
          const dayIndex = formattedData.findIndex((d) => d.name === item.page);
          if (dayIndex !== -1) {
            formattedData[dayIndex].traffic = item.visits || 0;
          }
        });

        setData(formattedData);
        setError(null);
      } catch (error) {
        console.error("Error fetching traffic data:", error.message);
        setError("Failed to load traffic data");
      } finally {
        setLoading(false);
      }
    };

    fetchTraffic();
    const interval = setInterval(fetchTraffic, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full max-w-sm md:max-w-md h-60 bg-white rounded-lg shadow-md overflow-hidden">
      {/* Title inside the chart with absolute positioning */}
      <h2 className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-2xl font-bold text-gray-200 z-0">
        Website Traffic
      </h2>

      {loading ? (
        <p className="text-center text-blue-600 mt-20">Loading...</p>
      ) : error ? (
        <p className="text-center text-red-600 mt-20">{error}</p>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 5, right: 5, left: 0, bottom: 0 }}
            barSize={32}
          >
            {/* Define gradient & glow effect */}
            <defs>
              <linearGradient id="purpleGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#A855F7" stopOpacity={0.9} />
                <stop offset="100%" stopColor="#7C3AED" stopOpacity={1} />
              </linearGradient>
              <filter id="purpleGlow">
                <feDropShadow
                  dx="0"
                  dy="0"
                  stdDeviation="3"
                  floodColor="#A855F7"
                />
              </filter>
            </defs>

            {/* Axis Styling */}
            <XAxis
              dataKey="name"
              stroke="#4A5568"
              tick={{ fill: "#333", fontSize: 12 }}
            />
            <YAxis stroke="#4A5568" />
            <Tooltip />

            {/* Bar with gradient & glow */}
            <Bar
              dataKey="traffic"
              fill="url(#purpleGradient)"
              radius={[8, 8, 0, 0]}
              style={{ filter: "url(#purpleGlow)" }}
            />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default TrafficBarChart;
