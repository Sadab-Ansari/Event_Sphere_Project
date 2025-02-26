"use client";

import { useState } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameMonth,
  isToday,
  subMonths,
  addMonths,
} from "date-fns";
// import { FaChevronRight } from "react-icons/fa";
import { CiCircleChevLeft, CiCircleChevRight } from "react-icons/ci";

const Calendar = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const startDate = startOfWeek(startOfMonth(currentMonth));
  const endDate = endOfWeek(endOfMonth(currentMonth));

  const days = [];
  let day = startDate;

  while (day <= endDate) {
    days.push(day);
    day = addDays(day, 1);
  }

  return (
    <div className="max-w-md mx-auto p-4 bg-white shadow-xl rounded-lg">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <button
          className="text-slate-300 hover:text-slate-400"
          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
        >
          <CiCircleChevLeft size={28} />
        </button>
        <h2 className="text-xl font-bold text-purple-700">
          {format(currentMonth, "MMMM yyyy")}
        </h2>
        <button
          className="text-slate-300 hover:text-slate-400"
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
        >
          <CiCircleChevRight size={28} />
        </button>
      </div>

      {/* Days of the Week */}
      <div className="grid grid-cols-7 text-center font-semibold text-gray-500 mb-2">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>

      {/* Calendar Days */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((date, index) => (
          <div
            key={index}
            className={`p-2 text-center rounded-full h-10 w-10 ${
              isSameMonth(date, currentMonth) ? "text-black" : "text-gray-400"
            } ${
              isToday(date)
                ? "bg-gradient-to-tr from-pink-500 to-red-500 text-white font-bold"
                : ""
            }`}
          >
            {format(date, "d")}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Calendar;
