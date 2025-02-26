"use client"; // Ensure this is at the top

import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Label } from "recharts";

const data = [
  { name: "Completed", value: 60 },
  { name: "Remaining", value: 40 },
];

const COLORS = ["#007bff", "#d1d5db"];

export default function ProgressPieChart() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true); // Set true only on the client
  }, []);

  if (!isClient) return null; // Avoid rendering on the server

  return (
    <div className=" bg-white relative w-64 h-60 flex items-center justify-center rounded-full mt-3 ml-0.5 shadow-2xl">
      <PieChart width={280} height={280}>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={82}
          outerRadius={139}
          startAngle={90}
          endAngle={-270}
          dataKey="value"
          isAnimationActive={true}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index]} />
          ))}
          <Label
            value={`${data[0].value}%`}
            position="center"
            fill="#333"
            style={{ fontSize: "30px", fontWeight: "bold" }}
          />
        </Pie>
      </PieChart>

      <div className="absolute top-[7%] right-[2%] bg-white px-4 py-1 text-lg font-bold rounded-full shadow-md">
        {data[1].value}%
      </div>
      <div className="absolute bottom-[12%] left-[2%] bg-white px-4 py-1 text-lg font-bold rounded-full shadow-md">
        {data[0].value}%
      </div>
    </div>
  );
}
