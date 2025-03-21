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
// import { AiFillMessage } from "react-icons/ai";
import {
  Home,
  Calendar,
  MessageCircle,
  LayoutDashboard,
  Info,
  User,
  PlusCircle,
  Menu,
  X,
} from "lucide-react";

const menuItems = [
  { icon: Home, href: "/", label: "Home" },
  { icon: User, href: "/profile", label: "Profile" },
  { icon: LayoutDashboard, href: "/dashboard", label: "Dashboard" },
  { icon: Calendar, href: "/events", label: "Events" },
  { icon: MessageCircle, href: "/messages", label: "Messages" },
  { icon: Info, href: "/about", label: "About" },
  { icon: PlusCircle, href: "/organize-event", label: "Organize" },
];

export default function SidebarMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Hide sidebar on the "/dashboard" page
  if (pathname === "/dashboard") return null;

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <div className="relative">
      {/* Desktop Sidebar */}
      <div className="hidden md:block w-16 h-screen bg-gray-800 shadow-xl flex flex-col items-center py-6 space-y-8 flex-shrink-0 fixed left-0 top-0 z-0">
        {menuItems.map((item, index) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={index}
              href={item.href}
              className="relative group flex w-full justify-center"
            >
              <div
                className={`flex items-center justify-center w-12 h-12 rounded-full transition-all ${
                  isActive
                    ? "bg-gradient-to-tr from-pink-500 to-red-500 text-white"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <item.icon size={24} />
              </div>

              <span className="absolute left-[70px] px-3 py-1 bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>

      {/* Mobile Hamburger Menu */}
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
          <Link href="/profile" className={`block px-4 py-2 rounded}`}>
            <FaUserCircle className="inline-block mr-2" /> Profile
          </Link>
          <Link href="/dashboard" className={`block px-4 py-2 rounded}`}>
            <FaHome className="inline-block mr-2" /> Dashboard
          </Link>
          <Link href="/events" className={`block px-4 py-2 rounded }`}>
            <FaCalendarAlt className="inline-block mr-2" /> Events
          </Link>
          <Link href="/about" className={`block px-4 py-2 rounded )}`}>
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
    </div>
  );
}
