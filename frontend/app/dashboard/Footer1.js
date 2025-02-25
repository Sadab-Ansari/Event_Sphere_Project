"use client";

import Link from "next/link";
import { FaFacebookF, FaTwitter, FaInstagram } from "react-icons/fa";

const Footer1 = () => {
  return (
    <div className="bg-gray-400 text-lg px-4 py-2 text-black font-semibold rounded-xl  h-auto md:h-16">
      {/* Desktop Layout (MD and larger) - No Size Change */}
      <div className="hidden md:flex justify-between items-center">
        {/* Left - EventManager */}
        <div className="text-left">
          <h2 className="text-xl font-bold">EventManager</h2>
          <p className="text-base mt-1">
            © {new Date().getFullYear()} All Rights Reserved
          </p>
        </div>

        {/* Middle - Navigation Links */}
        <div className="flex space-x-6">
          <Link href="/events" className="hover:underline">
            Events
          </Link>
          <Link href="/about" className="hover:underline">
            About
          </Link>
          <Link href="/contact" className="hover:underline">
            Contact
          </Link>
        </div>

        {/* Right - Social Media Icons */}
        <div className="flex space-x-6">
          <Link href="#" className="hover:text-blue-400">
            <FaFacebookF size={20} />
          </Link>
          <Link href="#" className="hover:text-blue-500">
            <FaTwitter size={20} />
          </Link>
          <Link href="#" className="hover:text-pink-400">
            <FaInstagram size={20} />
          </Link>
        </div>
      </div>

      {/* Mobile Layout (SM and below) - Increased Size */}
      <div className="md:hidden flex flex-col items-center text-center space-y-6 p-8">
        {/* Top - EventManager */}
        <div>
          <h2 className="text-2xl font-bold">EventManager</h2>
          <p className="text-lg mt-1">
            © {new Date().getFullYear()} All Rights Reserved
          </p>
        </div>

        {/* Middle - Navigation Links */}
        <div className="flex flex-col space-y-4 text-xl">
          <Link href="/events" className="hover:underline">
            Events
          </Link>
          <Link href="/about" className="hover:underline">
            About
          </Link>
          <Link href="/contact" className="hover:underline">
            Contact
          </Link>
        </div>

        {/* Bottom - Social Media Icons */}
        <div className="flex space-x-8 text-2xl">
          <Link href="#" className="hover:text-blue-400">
            <FaFacebookF />
          </Link>
          <Link href="#" className="hover:text-blue-500">
            <FaTwitter />
          </Link>
          <Link href="#" className="hover:text-pink-400">
            <FaInstagram />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Footer1;
