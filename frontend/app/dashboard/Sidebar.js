"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FaUserCircle,
  FaHome,
  FaCalendarAlt,
  FaInfoCircle,
  FaSignOutAlt,
} from "react-icons/fa";

const Sidebar = () => {
  const pathname = usePathname();

  const isActive = (path) =>
    pathname === path
      ? "bg-blue-500 text-white font-semibold"
      : "text-black hover:bg-gray-300";

  return (
    <div className="h-screen w-60 bg-pink-200 flex flex-col justify-between p-5 shadow-lg rounded-xl">
      <div className="space-y-2">
        <Link
          href="/profile"
          className={`flex items-center w-full px-4 py-2 space-x-3 rounded text-3xl ${isActive(
            "/profile"
          )}`}
        >
          <FaUserCircle size={36} />
          <span>Profile</span>
        </Link>
        <hr className="border-t border-gray-400 my-2" />

        <Link
          href="/dashboard"
          className={`flex items-center w-full px-4 py-2 space-x-3 rounded  text-xl ${isActive(
            "/dashboard"
          )}`}
        >
          <FaHome size={24} />
          <span>Dashboard</span>
        </Link>

        <Link
          href="/events"
          className={`flex items-center w-full px-4 py-2 space-x-3 rounded text-xl ${isActive(
            "/events"
          )}`}
        >
          <FaCalendarAlt size={24} />
          <span>Events</span>
        </Link>

        <Link
          href="/about"
          className={`flex items-center w-full px-4 py-2 space-x-3 rounded text-xl ${isActive(
            "/about"
          )}`}
        >
          <FaInfoCircle size={24} />
          <span>About</span>
        </Link>
      </div>

      <button
        className="flex items-center w-full px-4 py-2 space-x-3 rounded text-red-600 hover:bg-red-300 text-2xl"
        onClick={() => {
          localStorage.removeItem("token");
          window.location.href = "/login";
        }}
      >
        <FaSignOutAlt size={24} />
        <span>Logout</span>
      </button>
    </div>
  );
};

export default Sidebar;
