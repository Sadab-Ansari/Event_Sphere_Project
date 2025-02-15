"use client";

import { useState } from "react";

const EventSearch = ({ onSearch }) => {
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    onSearch(query);
  };

  return (
    <div className="bg-white p-4 shadow-md rounded-md flex items-center gap-2">
      <input
        type="text"
        className="w-full p-2 border border-gray-300 rounded-md"
        placeholder="Search events..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button
        className="bg-cyan-700 text-white px-4 py-2 rounded-md"
        onClick={handleSearch}
      >
        Search
      </button>
    </div>
  );
};

export default EventSearch;
