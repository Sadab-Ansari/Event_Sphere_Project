"use client";
import Link from "next/link";
import { MdCelebration } from "react-icons/md";
import { FaSlack } from "react-icons/fa6";
const TopNav = () => {
  return (
    <div className="bg-white shadow-lg text-black px-6 py-3 hidden md:flex justify-between items-center h-12 text-xl rounded-lg">
      <Link href="/" className="font-semibold flex items-center gap-2">
        <FaSlack size={24} />
        Event-Sphere{" "}
      </Link>
      <Link
        href="/organize-event"
        className="flex items-center gap-2 font-semibold"
      >
        <MdCelebration size={24} />
        organize event
      </Link>
    </div>
  );
};

export default TopNav;
