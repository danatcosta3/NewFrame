import React from "react";

function SearchBar() {
  return (
    <div className="relative w-full max-w-md">
      <input
        type="text"
        className="w-full py-2 pl-12 pr-4 bg-prim-offwhite rounded-3xl text-gray-700 focus:outline-none hover:ring-2 focus:ring-2 focus:ring-blue-500"
        placeholder="Search for movies..."
      />
      {/* Search Icon */}
      <img
        src="/images/SearchIcon.png"
        alt="Search"
        className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5"
      />
    </div>
  );
}

export default SearchBar;
