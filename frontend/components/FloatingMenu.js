"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef } from "react";
import DraggableCore from "react-draggable";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Calendar,
  MessageCircle,
  LayoutDashboard,
  Info,
  User,
  PlusCircle,
} from "lucide-react";

const menuItems = [
  { icon: <Home size={24} />, href: "/", label: "Home" },
  { icon: <User size={24} />, href: "/profile", label: "Profile" },
  {
    icon: <LayoutDashboard size={24} />,
    href: "/dashboard",
    label: "Dashboard",
  },
  { icon: <Calendar size={24} />, href: "/events", label: "Events" },
  { icon: <MessageCircle size={24} />, href: "/messages", label: "Messages" },
  { icon: <Info size={24} />, href: "/about", label: "About" },
  {
    icon: <PlusCircle size={24} />,
    href: "/organize-event",
    label: "Organize",
  },
];

export default function FloatingMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const menuRef = useRef(null);
  const pathname = usePathname();

  // ❌ Hide FloatingMenu on the "/dashboard" page
  if (pathname === "/dashboard") return null;

  const handleDragStart = () => {
    setIsDragging(true); // User is dragging
  };

  const handleDragStop = () => {
    setIsDragging(false); // User stopped dragging
  };

  const handleClick = () => {
    if (!isDragging) {
      // Only toggle the menu if not dragging
      setIsOpen(!isOpen);
    }
  };

  return (
    <DraggableCore
      nodeRef={menuRef}
      onStart={handleDragStart}
      onStop={handleDragStop}
    >
      <div
        ref={menuRef}
        className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 cursor-grab active:cursor-grabbing"
      >
        <AnimatePresence>
          {isOpen &&
            menuItems.map((item, index) => {
              const angle = (index / menuItems.length) * (2 * Math.PI);
              const x = 90 * Math.cos(angle);
              const y = 90 * Math.sin(angle);

              return (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, x: 0, y: 0, rotate: 360 }}
                  animate={{ opacity: 1, x, y, rotate: 0 }}
                  exit={{ opacity: 0, x: 0, y: 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 15,
                    delay: index * 0.05,
                  }}
                  className="absolute flex flex-col items-center group"
                >
                  <Link
                    href={item.href}
                    className="flex items-center justify-center w-12 h-12 bg-white shadow-md rounded-full hover:bg-blue-500 transition-all"
                  >
                    {item.icon}
                  </Link>
                  <span className="absolute bottom-14 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    {item.label}
                  </span>
                </motion.div>
              );
            })}
        </AnimatePresence>
        <motion.button
          onClick={handleClick}
          className="w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center relative group"
          whileTap={{ scale: 0.9 }}
        >
          <Home size={28} />
          {!isOpen && (
            <span className="absolute bottom-16 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
              Click to Navigate
            </span>
          )}
        </motion.button>
      </div>
    </DraggableCore>
  );
}
