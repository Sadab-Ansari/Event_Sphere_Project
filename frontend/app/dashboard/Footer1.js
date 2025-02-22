"use client";

import Link from "next/link";
import { FaFacebookF, FaTwitter, FaInstagram } from "react-icons/fa";

const Footer1 = () => {
  return (
    <div className="bg-gray-400 h-16 p-4 flex justify-between text-lg text-black font-semibold">
      {" "}
      <div className="text-center md:text-left flex items-center justify-center flex-col">
        <h2 className="text-xl font-bold">EventManager</h2>
        <p className="text-lg mt-1 ">
          © {new Date().getFullYear()} All Rights Reserved
        </p>
      </div>
      <div className="flex space-x-6 mt-4 md:mt-0 items-center justify-center">
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
      <div className="flex space-x-6 mt-4 md:mt-0 justify-center items-center">
        <Link href="#" className="hover:text-blue-400">
          <FaFacebookF size={24} />
        </Link>
        <Link href="#" className="hover:text-blue-500">
          <FaTwitter size={24} />
        </Link>
        <Link href="#" className="hover:text-pink-400">
          <FaInstagram size={24} />
        </Link>
      </div>
    </div>
  );
};

export default Footer1;
