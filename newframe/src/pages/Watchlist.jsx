import React, { useEffect } from "react";
import NavBar from "../components/NavBar";
import { useState } from "react";
import axios from "axios";
import SearchBar from "../components/SearchBar";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import apiClient from "../apiClient";

function Watchlist() {
  const [watchlist, setWatchlist] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await apiClient.get("/watchlist/get");
        setWatchlist(response.data);
      } catch (error) {
        alert("Couldn't get watchlist");
        console.log("Error fetching watchlist: ", error);
      }
    };
    fetchUserData();
  }, []);

  const handleSearch = (movie) => {
    if (movie && movie.tmdb_id) {
      navigate(`/movies/${movie.tmdb_id}`);
    } else {
      console.error("Invalid movie object:", movie);
    }
  };

  const handleDelete = async (tmdb_id) => {
    try {
      const response = await apiClient.delete("/watchlist/delete", {
        data: { tmdb_id },
      });
      setWatchlist((prev) => prev.filter((movie) => movie.tmdb_id !== tmdb_id));
    } catch (error) {
      console.error("Error removing movie from watchlist:", error);
      alert("Failed to remove movie from watchlist.");
    }
  };
  return (
    <div className="min-h-screen">
      <div className="flex overflow-x-hidden">
        <NavBar />
        <div className="flex-1 ml-[20%] pt-5 pl-4 ">
          <SearchBar onSearch={handleSearch} />
          {/* Watchlist detials */}
          <h1 className="mt-4 font-bold text-3xl">Your Watchlist:</h1>
          <div>
            {watchlist && watchlist.length > 0 ? (
              watchlist.map((movie) => (
                <div className="mt-5 py-3">
                  <div className="flex">
                    <div
                      key={movie.tmdb_id}
                      className="flex-shrink-0 w-[100px] h-[160px] hover:scale-105 transform transition duration-200"
                    >
                      <img
                        src={movie.posterURL}
                        alt={movie.title}
                        onClick={() => navigate(`/movies/${movie.tmdb_id}`)}
                      />
                    </div>
                    <div className="ml-3">
                      <div className="flex justify-between">
                        <h1 className="text-lg font-semibold">{movie.title}</h1>
                        <img
                          src="/images/DeleteIcon.png"
                          alt="Search"
                          className="mr-3 w-6 h-6 hover:bg-red-200 rounded"
                          onClick={() => handleDelete(movie.tmdb_id)}
                        />
                      </div>
                      <p className="italic mt-3">{movie.description}</p>
                    </div>
                  </div>
                  <hr className="border" />
                </div>
              ))
            ) : (
              <p className="text-gray-500">Loading movies...</p>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Watchlist;
