import axios from "axios";
import React, { useState, useEffect } from "react";
import MovieWithRating from "./MovieWithRating";
import apiClient from "../apiClient";

function RatingModal({ onSubmit }) {
  const [movieRatings, setMovieRatings] = useState({});

  const moviesList = [
    {
      title: "The Shawshank Redemption",
      posterURL:
        "https://image.tmdb.org/t/p/w500/9cqNxx0GxF0bflZmeSMuL5tnGzr.jpg",
      tmdb_id: 278,
    },
    {
      title: "Inception",
      posterURL:
        "https://image.tmdb.org/t/p/w500/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg",
      tmdb_id: 27205,
    },
    {
      title: "The Godfather",
      posterURL:
        "https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg",
      tmdb_id: 238,
    },
    {
      title: "Pulp Fiction",
      posterURL:
        "https://image.tmdb.org/t/p/w500/vQWk5YBFWF4bZaofAbv0tShwBvQ.jpg",
      tmdb_id: 680,
    },
    {
      title: "Titanic",
      posterURL:
        "https://image.tmdb.org/t/p/w500/9xjZS2rlVxm8SFx8kPC3aIGCOYQ.jpg",
      tmdb_id: 597,
    },
    {
      title: "The Notebook",
      posterURL:
        "https://image.tmdb.org/t/p/w500/rNzQyW4f8B8cQeg7Dgj3n6eT5k9.jpg",
      tmdb_id: 11036,
    },
    {
      title: "Call Me by Your Name",
      posterURL:
        "https://image.tmdb.org/t/p/w500/mZ4gBdfkhP9tvLH1DO4m4HYtiyi.jpg",
      tmdb_id: 398818,
    },
    {
      title: "Frozen",
      posterURL:
        "https://image.tmdb.org/t/p/w500/mbPrrbt8bSLcHSBCHnRclPlMZPl.jpg",
      tmdb_id: 109445,
    },
    {
      title: "The Lion King",
      posterURL:
        "https://image.tmdb.org/t/p/w500/sKCr78MXSLixwmZ8DyJLrpMsd15.jpg",
      tmdb_id: 8587,
    },
    {
      title: "La La Land",
      posterURL:
        "https://image.tmdb.org/t/p/w500/uDO8zWDhfWwoFdKS4fzkUJt0Rf0.jpg",
      tmdb_id: 313369,
    },
    {
      title: "The Matrix",
      posterURL:
        "https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg",
      tmdb_id: 603,
    },
    {
      title: "The Princess Diaries",
      posterURL:
        "https://image.tmdb.org/t/p/w500/wA4lgl8gmoICSShviCkEB61nIBB.jpg",
      tmdb_id: 9880,
    },
    {
      title: "Wonder Woman",
      posterURL:
        "https://image.tmdb.org/t/p/w500/imekS7f1OuHyUP2LAiTEM0zBzUz.jpg",
      tmdb_id: 297762,
    },
    {
      title: "The Avengers",
      posterURL:
        "https://image.tmdb.org/t/p/w500/RYMX2wcKCBAr24UyPD7xwmjaTn.jpg",
      tmdb_id: 24428,
    },
    {
      title: "Legally Blonde",
      posterURL:
        "https://image.tmdb.org/t/p/w500/9ohlMrJHQqKhfUKh7Zr3JQqHNLZ.jpg",
      tmdb_id: 8835,
    },
    {
      title: "Forrest Gump",
      posterURL:
        "https://image.tmdb.org/t/p/w500/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg",
      tmdb_id: 13,
    },
    {
      title: "Clueless",
      posterURL:
        "https://image.tmdb.org/t/p/w500/i6oWPOklGIDKG45tPjcLNH0fRNO.jpg",
      tmdb_id: 9603,
    },
    {
      title: "Step Brothers",
      posterURL:
        "https://image.tmdb.org/t/p/w500/wRR6U3K3v2iQsG3uw7ehz1ctRyT.jpg",
      tmdb_id: 12133,
    },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Object.keys(movieRatings).length < 5) {
      alert("Please enter at least 5 ratings.");
    } else {
      try {
        const filteredRatings = Object.entries(movieRatings)
          .filter(([_, rating]) => rating > 0)
          .map(([tmdb_id, rating]) => ({
            tmdb_id: parseInt(tmdb_id),
            rating,
          }));

        const response = await axios.post(
          "http://localhost:5001/api/saveRatings",
          {
            movieRatings: filteredRatings,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );
        if (response.status === 200) {
          onSubmit();
        }
      } catch (error) {
        console.error("Error saving ratings", error);
        alert("Error saving ratings. Please try again.");
      }
    }
  };

  const handleRatingChange = (movieId, rating) => {
    setMovieRatings((prev) => ({
      ...prev,
      [movieId]: Number(rating),
    }));
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
      <div className="bg-white w-full max-w-7xl rounded-lg shadow-lg p-8 flex flex-col items-center h-[90vh]">
        {/* Text and Buttons in One Row */}
        <div className="flex items-center justify-between w-full">
          <div>
            <h3 className="text-3xl text-black font-bold text-center mb-2">
              Help us learn more about you.
            </h3>
            <h4 className="text-lg text-gray-600">
              Click on movies you have seen and give your rating
            </h4>
          </div>
          <form action="submit" onSubmit={handleSubmit}>
            <div className="flex space-x-4">
              <button className="px-6 py-3 border border-gray-400 rounded-md text-lg hover:bg-gray-100">
                Clear
              </button>
              <button className="bg-blue-600 text-white px-6 py-3 rounded-md text-lg hover:bg-blue-500">
                Submit
              </button>
            </div>
          </form>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 overflow-y-auto">
          {/* Rendering the Movie component */}
          {moviesList.map((movie) => (
            <MovieWithRating
              key={movie.tmdb_id}
              movie={movie}
              onRatingChange={handleRatingChange}
            />
          ))}
        </div>
        {/* Other Content */}
      </div>
    </div>
  );
}

export default RatingModal;
