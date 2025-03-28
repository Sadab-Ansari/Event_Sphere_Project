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
  { icon: MessageCircle, href: "/chat", label: "Messages" },
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
      router.push("/dashboard");
    } else if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    router.push("/login");
  };

  if (["/dashboard", "/", "/login", "/signup"].includes(pathname)) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="hidden md:flex fixed top-4 left-2 z-50 bg-gray-800 p-3 rounded-full text-gray-200 hover:text-white pl-3"
      >
        <Menu size={24} />
      </button>

      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: isOpen ? "100vh" : 0, opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="hidden md:flex flex-col items-center bg-gray-800 fixed left-0 top-0 w-16 z-40"
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
                <span className="absolute left-16 top-1/2 -translate-y-1/2 px-3 py-1 bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all duration-300 whitespace-nowrap">
                  {item.label}
                </span>
              </motion.div>
            );
          })}

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
    </div>
  );
}
