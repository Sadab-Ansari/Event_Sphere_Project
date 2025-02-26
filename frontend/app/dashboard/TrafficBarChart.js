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
  const defaultData = [
    { name: "Mon", traffic: 0 },
    { name: "Tue", traffic: 0 },
    { name: "Wed", traffic: 0 },
    { name: "Thu", traffic: 0 },
    { name: "Fri", traffic: 0 },
    { name: "Sat", traffic: 0 },
    { name: "Sun", traffic: 0 },
  ];

  const [data, setData] = useState(defaultData);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTraffic = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/traffic");

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();

        if (!Array.isArray(result) || result.length === 0) {
          throw new Error("Invalid data format received");
        }

        setData(result);
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
    <div className="bg-green-200 p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-center mb-4">
        Website Traffic
      </h2>

      {loading ? (
        <p className="text-center text-blue-600">Loading...</p>
      ) : error ? (
        <p className="text-center text-red-600">{error}</p>
      ) : (
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={data}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="traffic" fill="#4CAF50" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default TrafficBarChart;
