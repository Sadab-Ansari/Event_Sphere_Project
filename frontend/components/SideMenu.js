"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Menu,
  Home,
  Calendar,
  MessageCircle,
  LayoutDashboard,
  Info,
  User,
  PlusCircle,
} from "lucide-react";
import { FaUserCircle, FaSignOutAlt, FaBars } from "react-icons/fa";
import { MdCelebration } from "react-icons/md";
import { FaSlack } from "react-icons/fa6";

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
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const urlParams = new URLSearchParams(window.location.search);
    const googleToken = urlParams.get("token");

    if (googleToken) {
      localStorage.setItem("token", googleToken);
      setIsLoggedIn(true);
      router.push("/dashboard"); // Redirect after login
    } else if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    router.push("/login"); // Redirect to login page
  };

  if (pathname === "/dashboard") return null;

  return (
    <div className="relative w-16">
      {/* Hamburger Icon */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="hidden md:flex fixed top-4 left-2 z-50 bg-gray-800 p-3 rounded-full text-gray-200 hover:text-white pl-3"
      >
        <Menu size={24} />
      </button>

      {/* Desktop Sidebar */}
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: isOpen ? "100vh" : 0, opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className={`hidden md:flex flex-col items-center bg-gray-800 fixed left-0 top-0 w-16 z-40 overflow-hidden ${
          isOpen ? "shadow-xl" : "shadow-none"
        }`}
      >
        <div className="py-6 space-y-8 mt-14">
          {menuItems.map((item, index) => {
            const isActive = pathname === item.href;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: isOpen ? 1 : 0, y: isOpen ? 0 : -20 }}
                transition={{ delay: index * 0.1 }}
                className="relative group"
              >
                <Link
                  href={item.href}
                  className="relative flex w-full justify-center"
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
                </Link>

                {/* Hover label */}
                <span className="absolute left-16 top-1/2 -translate-y-1/2 px-3 py-1 bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all duration-300 whitespace-nowrap">
                  {item.label}
                </span>
              </motion.div>
            );
          })}

          {/* Logout Button (Only visible when logged in) */}
          {isLoggedIn && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: isOpen ? 1 : 0, y: isOpen ? 0 : -20 }}
              transition={{ delay: 0.7 }}
              className="relative group"
            >
              <button
                onClick={handleLogout}
                className="relative flex w-full justify-center"
              >
                <div className="flex items-center justify-center w-12 h-12 rounded-full text-gray-400 hover:text-red-500">
                  <FaSignOutAlt size={24} />
                </div>
              </button>
              <span className="absolute left-16 top-1/2 -translate-y-1/2 px-3 py-1 bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all duration-300 whitespace-nowrap">
                Logout
              </span>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Mobile Hamburger Menu */}
      <div>
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
            <Link href="/profile" className="block px-4 py-2 rounded">
              <FaUserCircle className="inline-block mr-2" /> Profile
            </Link>
            <Link href="/dashboard" className="block px-4 py-2 rounded">
              <Home className="inline-block mr-2" /> Dashboard
            </Link>
            <Link href="/events" className="block px-4 py-2 rounded">
              <Calendar className="inline-block mr-2" /> Events
            </Link>
            <Link href="/about" className="block px-4 py-2 rounded">
              <Info className="inline-block mr-2" /> About
            </Link>
            <Link
              href="/organize-event"
              className="block px-4 py-2 rounded font-semibold text-green-600 hover:bg-green-200"
            >
              <MdCelebration className="inline-block mr-2" /> Organize Event
            </Link>
            {isLoggedIn && (
              <button
                className="block w-full text-left px-4 py-2 rounded text-red-600 hover:bg-red-300"
                onClick={handleLogout}
              >
                <FaSignOutAlt className="inline-block mr-2" /> Logout
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
