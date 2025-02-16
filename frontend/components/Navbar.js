"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaBars, FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { MdEvent } from "react-icons/md"; // Added event icon

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
    <nav className="bg-white/30 backdrop-blur-lg shadow-md sticky top-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center h-16">
        {/* Logo */}
        <Link href="/">
          <span className="text-2xl font-bold text-blue-600 cursor-pointer">
            EventHub
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6 text-gray-700">
          <Link href="/events" className="hover:text-blue-500">
            Events
          </Link>
          <Link href="/about" className="hover:text-blue-500">
            About
          </Link>
          <Link href="/contact" className="hover:text-blue-500">
            Contact
          </Link>
        </div>

        {/* Authentication & Hamburger Menu for Desktop */}
        <div className="hidden md:flex items-center space-x-4 relative">
          {isLoggedIn ? (
            <>
              <Link href="/profile">
                <FaUserCircle
                  size={28}
                  className="text-blue-600 cursor-pointer"
                />
              </Link>

              {/* Hamburger menu for features */}
              <button onClick={toggleDropdown} className="text-gray-700">
                <FaBars size={24} />
              </button>

              {/* Dropdown menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 top-12 bg-white shadow-lg rounded-md py-2 w-48">
                  <Link
                    href="/organize-event"
                    className=" px-4 py-2 text-gray-700 hover:bg-gray-200 flex items-center space-x-2"
                  >
                    <MdEvent size={20} />
                    <span>Organize Event</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-red-600 hover:text-red-800 ml-5 flex mt-2"
                  >
                    <FaSignOutAlt size={20} />
                    <p className="ml-2">Logout</p>
                  </button>
                </div>
              )}
            </>
          ) : (
            <>
              <Link href="/login" className="text-blue-600 hover:text-blue-800">
                Login
              </Link>
              <Link
                href="/signup"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-800"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-gray-700" onClick={toggleMenu}>
          {isMenuOpen ? <IoClose size={28} /> : <FaBars size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-md py-4 px-6 space-y-4">
          <Link
            href="/events"
            className="block text-gray-700 hover:text-blue-500"
          >
            Events
          </Link>
          <Link
            href="/about"
            className="block text-gray-700 hover:text-blue-500"
          >
            About
          </Link>
          <Link
            href="/contact"
            className="block text-gray-700 hover:text-blue-500"
          >
            Contact
          </Link>
          {isLoggedIn ? (
            <>
              <Link
                href="/profile"
                className="flex items-center space-x-2 text-gray-700 hover:text-blue-500"
              >
                <FaUserCircle size={24} />
                <span>Profile</span>
              </Link>
              <Link
                href="/organize-event"
                className="flex items-center gap-2 text-gray-700 hover:text-blue-500"
              >
                <MdEvent size={20} /> {/* Ensure you import the correct icon */}
                <span>Organize Event</span>
              </Link>

              <button
                onClick={handleLogout}
                className="block w-full text-left text-red-600 hover:text-red-800"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="block text-blue-600 hover:text-blue-800"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-800"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
