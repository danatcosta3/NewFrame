import React, { useState, useEffect } from "react";
import axios from "axios";
import { debounce } from "lodash";

function SearchBar({ onSearch }) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      setActiveIndex((prevIndex) =>
        prevIndex < suggestions.length - 1 ? prevIndex + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      setActiveIndex((prevIndex) =>
        prevIndex > 0 ? prevIndex - 1 : suggestions.length - 1
      );
    } else if (e.key === "Enter" && activeIndex >= 0) {
      handleSuggestionClick(suggestions[activeIndex]);
    }
  };

  const handleSuggestionClick = (movie) => {
    onSearch(movie);
    setQuery(movie.title);
    setSuggestions([]);
  };

  useEffect(() => {
    const fetchSuggestions = debounce(async () => {
      if (query.trim() === "") {
        setSuggestions([]);
        return;
      }

      setLoading(true);
      try {
        const response = await axios.get(
          "http://localhost:5001/api/movies/search",
          {
            params: { query },
          }
        );
        setSuggestions(response.data);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
      } finally {
        setLoading(false);
      }
    }, 300);

    fetchSuggestions();
    return () => fetchSuggestions.cancel();
  }, [query]);

  return (
    <div className="relative w-full max-w-md">
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        className="w-full py-2 pl-12 pr-10 bg-prim-offwhite rounded-3xl text-gray-700 focus:outline-none hover:ring-2 focus:ring-2 focus:ring-blue-500 hover:ring-blue-500"
        placeholder="Search for movies..."
      />
      {/* Search Icon */}
      <img
        src="/images/SearchIcon.png"
        alt="Search"
        className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5"
      />
      {/* Loading Spinner */}
      {loading && (
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
      )}
      {/* Suggestions Dropdown */}
      {suggestions.length > 0 && (
        <ul className="absolute z-10 bg-white border border-gray-300 rounded-lg mt-1 w-full shadow-lg max-h-64 overflow-y-auto">
          {suggestions.map((movie, index) => (
            <li
              key={movie.tmdb_id}
              onClick={() => handleSuggestionClick(movie)}
              className={`px-4 py-2 cursor-pointer hover:bg-blue-100 hover:text-blue-700 ${
                index === activeIndex ? "bg-blue-100 text-blue-700" : ""
              }`}
            >
              {movie.title}
            </li>
          ))}
        </ul>
      )}
      {/* No Results */}
      {!loading && suggestions.length === 0 && query.trim() !== "" && (
        <div className="absolute z-10 bg-white border border-gray-300 rounded-lg mt-1 w-full shadow-lg px-4 py-2 text-gray-500">
          No results found
        </div>
      )}
    </div>
  );
}

export default SearchBar;
