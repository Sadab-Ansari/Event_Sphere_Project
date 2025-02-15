"use client";

import Link from "next/link";
import { FaFacebookF, FaTwitter, FaInstagram } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-6">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center px-6">
        {/* Logo & Copyright */}
        <div className="text-center md:text-left">
          <h2 className="text-xl font-bold">EventManager</h2>
          <p className="text-sm mt-1">
            © {new Date().getFullYear()} All Rights Reserved
          </p>
        </div>

        {/* Navigation Links */}
        <div className="flex space-x-6 mt-4 md:mt-0">
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

        {/* Social Media Icons */}
        <div className="flex space-x-4 mt-4 md:mt-0">
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
    </footer>
  );
};

export default Footer;
