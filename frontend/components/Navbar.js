"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaBars, FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { MdEvent } from "react-icons/md"; // Event icon

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const urlParams = new URLSearchParams(window.location.search);
    const googleToken = urlParams.get("token");

    if (googleToken) {
      localStorage.setItem("token", googleToken);
      setIsLoggedIn(true);
    } else if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    router.push("/");
  };

  return (
    <>
      {/* Main Navbar */}
      <nav className="bg-transparent backdrop-blur-lg shadow-md sticky top-0 w-full z-50 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/">
            <span className="text-2xl font-bold text-blue-500 cursor-pointer">
              EventHub
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-6 text-black text-lg">
            <Link href="/events" className="hover:text-blue-400 transition">
              Events
            </Link>
            <Link href="/about" className="hover:text-blue-400 transition">
              About
            </Link>
            <Link href="/contact" className="hover:text-blue-400 transition">
              Contact
            </Link>
          </div>

          {/* ✅ Profile Section (Separate from Hamburger) */}
          <div className="hidden md:flex items-center gap-4 pr-6">
            {isLoggedIn ? (
              <>
                <Link href="/profile">
                  <FaUserCircle
                    size={28}
                    className="text-red-400 cursor-pointer"
                  />
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-blue-400 hover:text-blue-600"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* ✅ Separate Container for Hamburger Icon */}
      {isLoggedIn && (
        <div className="fixed top-5 right-8 z-50">
          <button onClick={toggleDropdown} className="text-black">
            <FaBars size={26} />
          </button>

          {/* ✅ Dropdown Menu - Flush to Right */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-3 w-48 bg-gray-900 shadow-lg rounded-md py-2 border border-gray-700">
              <Link
                href="/organize-event"
                className="px-4 py-2 text-white hover:bg-gray-700 flex items-center space-x-2"
              >
                <MdEvent size={20} />
                <span>Organize Event</span>
              </Link>
              <button
                onClick={handleLogout}
                className="text-red-500 hover:text-red-700 ml-5 flex mt-2"
              >
                <FaSignOutAlt size={20} />
                <p className="ml-2">Logout</p>
              </button>
            </div>
          )}
        </div>
      )}

      {/* ✅ Mobile Menu Button */}
      <div className="md:hidden flex items-center gap-4 fixed top-4 right-4 z-50">
        <button className="text-white" onClick={toggleMenu}>
          {isMenuOpen ? <IoClose size={28} /> : <FaBars size={28} />}
        </button>
      </div>

      {/* ✅ Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-gray-900/90 backdrop-blur-md shadow-md py-4 px-6 space-y-4 border-t border-gray-700">
          <Link
            href="/events"
            className="block text-white hover:text-blue-400 transition"
          >
            Events
          </Link>
          <Link
            href="/about"
            className="block text-white hover:text-blue-400 transition"
          >
            About
          </Link>
          <Link
            href="/contact"
            className="block text-white hover:text-blue-400 transition"
          >
            Contact
          </Link>
          {isLoggedIn ? (
            <>
              <Link
                href="/profile"
                className="flex items-center space-x-2 text-white hover:text-blue-400 transition"
              >
                <FaUserCircle size={24} />
                <span>Profile</span>
              </Link>
              <Link
                href="/organize-event"
                className="flex items-center gap-2 text-white hover:text-blue-400 transition"
              >
                <MdEvent size={20} />
                <span>Organize Event</span>
              </Link>

              <button
                onClick={handleLogout}
                className="block w-full text-left text-red-500 hover:text-red-700 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="block text-blue-400 hover:text-blue-600 transition"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="block bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default Navbar;
