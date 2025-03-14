"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FaUserCircle,
  FaHome,
  FaCalendarAlt,
  FaInfoCircle,
  FaSignOutAlt,
  FaBars,
} from "react-icons/fa";
import { MdCelebration } from "react-icons/md";
import { FaSlack } from "react-icons/fa6";
import { AiFillMessage } from "react-icons/ai";
const Sidebar = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (path) =>
    pathname === path
      ? "bg-blue-500 text-white font-semibold"
      : "text-black hover:bg-gray-300";

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="h-screen w-60 bg-white flex-col justify-between p-5 shadow-lg rounded-xl hidden md:flex">
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
            className={`flex items-center w-full px-4 py-2 space-x-3 rounded text-xl ${isActive(
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
            href="/chat"
            className={`flex items-center w-full px-4 py-2 space-x-3 rounded text-xl ${isActive(
              "/chat"
            )}`}
          >
            <AiFillMessage size={24} />
            <span>messages</span>
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

      {/* Mobile Sidebar */}
      <div className="md:hidden flex justify-between items-center p-4 bg-pink-200 shadow-lg rounded-xl">
        <button onClick={() => setIsOpen(!isOpen)} className="text-2xl">
          <FaBars />
        </button>
        <Link
          href="/"
          className="font-semibold flex items-center gap-2 text-xl"
        >
          <FaSlack size={24} /> Event-Sphere
        </Link>
      </div>
      {isOpen && (
        <div className="md:hidden bg-pink-100 p-4 rounded-xl shadow-lg space-y-2 z-50">
          <Link
            href="/profile"
            className={`block px-4 py-2 rounded ${isActive("/profile")}`}
          >
            <FaUserCircle className="inline-block mr-2" /> Profile
          </Link>
          <Link
            href="/dashboard"
            className={`block px-4 py-2 rounded ${isActive("/dashboard")}`}
          >
            <FaHome className="inline-block mr-2" /> Dashboard
          </Link>
          <Link
            href="/events"
            className={`block px-4 py-2 rounded ${isActive("/events")}`}
          >
            <FaCalendarAlt className="inline-block mr-2" /> Events
          </Link>
          <Link
            href="/about"
            className={`block px-4 py-2 rounded ${isActive("/about")}`}
          >
            <FaInfoCircle className="inline-block mr-2" /> About
          </Link>
          <Link
            href="/organize-event"
            className="block px-4 py-2 rounded font-semibold text-green-600 hover:bg-green-200"
          >
            <MdCelebration className="inline-block mr-2" /> Organize Event
          </Link>
          <button
            className="block w-full text-left px-4 py-2 rounded text-red-600 hover:bg-red-300"
            onClick={() => {
              localStorage.removeItem("token");
              window.location.href = "/login";
            }}
          >
            <FaSignOutAlt className="inline-block mr-2" /> Logout
          </button>
        </div>
      )}
    </>
  );
};

export default Sidebar;
