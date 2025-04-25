"use client";

import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Label } from "recharts";

export default function ProgressPieChart() {
  const [progress, setProgress] = useState(60); //  Static Default (60% completed)
  const [remaining, setRemaining] = useState(40);
  const [isClient, setIsClient] = useState(false);
  const [isDynamic, setIsDynamic] = useState(false); //  Toggle for Dynamic Mode

  useEffect(() => {
    setIsClient(true);

    //  Remove this condition to fetch real data
    if (isDynamic) {
      fetchProgress();
    }
  }, [isDynamic]);

  const fetchProgress = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/progress`
      );

      const data = await response.json();
      if (data) {
        const completed = data.completed || 0;
        const total = data.total || 100;
        const progressValue = Math.round((completed / total) * 100);
        setProgress(progressValue);
        setRemaining(100 - progressValue);
      }
    } catch (error) {
      console.error("Error fetching progress:", error);
    }
  };

  if (!isClient) return null;

  const COLORS = ["url(#purpleGradient)", "#A78BFA"];

  return (
    <div className="bg-white relative w-64 h-60 flex items-center justify-center rounded-full mt-3 ml-0.5 shadow-2xl">
      <svg width="0" height="0">
        <defs>
          <linearGradient id="purpleGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#A855F7" stopOpacity={0.9} />
            <stop offset="100%" stopColor="#7C3AED" stopOpacity={1} />
          </linearGradient>
          <filter id="purpleGlow">
            <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#A855F7" />
          </filter>
        </defs>
      </svg>
      <PieChart width={280} height={280}>
        <Pie
          data={[
            { name: "Completed", value: progress },
            { name: "Remaining", value: remaining },
          ]}
          cx="50%"
          cy="50%"
          innerRadius={82}
          outerRadius={139}
          startAngle={90}
          endAngle={580}
          dataKey="value"
          isAnimationActive={true}
        >
          <Cell fill={COLORS[0]} style={{ filter: "url(#purpleGlow)" }} />
          <Cell fill={COLORS[1]} />
          <Label
            value={`${progress}%`}
            position="center"
            fill="#333"
            style={{ fontSize: "30px", fontWeight: "bold" }}
          />
        </Pie>
      </PieChart>
      <div className="absolute bottom-[12%] left-[2%] bg-white px-4 py-1 text-lg font-bold rounded-full shadow-md">
        {progress}%
      </div>
    </div>
  );
}
