import axios from "axios";
import React, { useState, useEffect } from "react";
import Movie from "./Movie";

function RatingModal({ onSubmit }) {
  const [movie, setMovie] = useState(null);
  const [movieRatings, setMovieRatings] = useState({});

  useEffect(() => {
    const fetchMovie = async () => {
      const tempName = "Step Brothers";

      try {
        const response = await axios.post("http://localhost:5001/api/movie", {
          name: tempName,
        });
        setMovie(response.data);
      } catch (error) {
        alert("Error fetching movie data.");
        console.error("Error fetching movie", error);
      }
    };
    fetchMovie();
  }, []);

  const handleRatingChange = (movieId, rating) => {
    setMovieRatings((prev) => ({ ...prev, [movieId]: rating }));
  };

  if (!movie) {
    return <div>Loading...</div>;
  }

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
      <div className="bg-white w-full max-w-7xl rounded-lg shadow-lg p-8 flex flex-col items-center h-[78vh]">
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
          <div className="flex space-x-4">
            <button className="px-6 py-3 border border-gray-400 rounded-md text-lg hover:bg-gray-100">
              Clear
            </button>
            <button className="bg-blue-600 text-white px-6 py-3 rounded-md text-lg hover:bg-blue-500">
              Submit
            </button>
          </div>
        </div>
        <div className="border-2 w-full h-full flex flex-wrap items-center justify-center gap-8">
          {/* Rendering the Movie component */}
          <Movie
            key={movie.tmdb_id}
            movie={movie}
            onRatingChange={handleRatingChange}
          />
          <Movie
            key={movie.tmdb_id}
            movie={movie}
            onRatingChange={handleRatingChange}
          />
          <Movie
            key={movie.tmdb_id}
            movie={movie}
            onRatingChange={handleRatingChange}
          />
          <Movie
            key={movie.tmdb_id}
            movie={movie}
            onRatingChange={handleRatingChange}
          />
          <Movie
            key={movie.tmdb_id}
            movie={movie}
            onRatingChange={handleRatingChange}
          />
          <Movie
            key={movie.tmdb_id}
            movie={movie}
            onRatingChange={handleRatingChange}
          />
          <Movie
            key={movie.tmdb_id}
            movie={movie}
            onRatingChange={handleRatingChange}
          />
          <Movie
            key={movie.tmdb_id}
            movie={movie}
            onRatingChange={handleRatingChange}
          />
          <Movie
            key={movie.tmdb_id}
            movie={movie}
            onRatingChange={handleRatingChange}
          />
          <Movie
            key={movie.tmdb_id}
            movie={movie}
            onRatingChange={handleRatingChange}
          />
          <Movie
            key={movie.tmdb_id}
            movie={movie}
            onRatingChange={handleRatingChange}
          />
          <Movie
            key={movie.tmdb_id}
            movie={movie}
            onRatingChange={handleRatingChange}
          />
          <Movie
            key={movie.tmdb_id}
            movie={movie}
            onRatingChange={handleRatingChange}
          />
          <Movie
            key={movie.tmdb_id}
            movie={movie}
            onRatingChange={handleRatingChange}
          />
          <Movie
            key={movie.tmdb_id}
            movie={movie}
            onRatingChange={handleRatingChange}
          />
          <Movie
            key={movie.tmdb_id}
            movie={movie}
            onRatingChange={handleRatingChange}
          />
          <Movie
            key={movie.tmdb_id}
            movie={movie}
            onRatingChange={handleRatingChange}
          />
          <Movie
            key={movie.tmdb_id}
            movie={movie}
            onRatingChange={handleRatingChange}
          />
        </div>
        {/* Other Content */}
      </div>
    </div>
  );
}

export default RatingModal;
