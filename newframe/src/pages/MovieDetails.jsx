import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import NavBar from "../components/NavBar";
import apiClient from "../apiClient";
import RateMovieModal from "../components/RateMovieModal";
import SuccessModal from "../components/SuccessModal";

function MovieDetails() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [error, setError] = useState(null);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [showSucessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const response = await fetch(`http://localhost:5001/api/movies/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch movie details");
        }
        const data = await response.json();
        setMovie(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchMovie();
  }, [id]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!movie) {
    return (
      <div className="flex h-screen w-screen justify-center items-center text-lg italic text-blue-500">
        Loading...
      </div>
    );
  }

  const handleWatchlist = async () => {
    try {
      const response = await apiClient.post("/watchlist", {
        tmdb_id: id,
      });

      if (response.data.message === "Already in watchlist") {
        setSuccessMessage("Movie is already in your watchlist!");
      } else if (response.data.message) {
        setSuccessMessage("Movie added to your watchlist!");
      } else {
        setSuccessMessage("Movie added to your watchlist!");
      }

      setShowSuccessModal(false);
      setTimeout(() => {
        setShowSuccessModal(true);
      }, 0);
    } catch (error) {
      alert("Could not add to watchlist");
      console.error("Error adding to watchlist:", error);
    }
  };

  const handleRate = () => {
    setShowRatingModal(true);
  };
  const handleCloseRate = () => {
    setShowRatingModal(false);
    setSuccessMessage("Movie Successfully Rated");
    setShowSuccessModal(true);
  };
  const handleCloseRateWO = () => {
    setShowRatingModal(false);
  };
  return (
    <div className="flex">
      <NavBar />
      {showRatingModal && (
        <RateMovieModal
          handleCloseRate={handleCloseRate}
          movieId={id}
          handleCloseRateWO={handleCloseRateWO}
        />
      )}
      {showSucessModal && (
        <SuccessModal
          message={successMessage}
          onClose={() => setShowSuccessModal(false)}
        />
      )}
      {/* Right Panel */}
      <div className="flex-1 ml-[20%] flex justify-center items-center h-screen px-8 shadow-lg">
        <div className="flex items-start gap-8">
          {/* Movie Poster */}
          <img
            src={movie.posterURL}
            alt={movie.title}
            className="rounded-3xl w-[300px] h-auto flex-shrink-0"
          />

          {/* Movie Details */}
          <div className="flex flex-col">
            <h1 className="text-4xl font-bold text-left mb-6">{movie.title}</h1>
            <strong>Description:</strong>
            <p className="mb-4">
              {movie.description || "No description available."}
            </p>

            {/* Genres */}
            <div className="mb-4">
              <strong>Genres:</strong>
              <div className="flex flex-wrap gap-2 mt-2">
                {movie.genre?.map((genre, index) => (
                  <span
                    key={index}
                    className="bg-prim-blue-p text-white rounded-full px-3 py-1 text-sm"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            </div>

            {/* Actors */}
            <div>
              <strong>Actors:</strong>
              <div className="flex flex-wrap gap-2 mt-2">
                {movie.actors?.slice(0, 10).map((actor, index) => (
                  <span
                    key={index}
                    className="bg-prim-blue-p text-white rounded-full px-3 py-1 text-sm"
                  >
                    {actor}
                  </span>
                ))}
                {movie.actors?.length > 10 && (
                  <span className="text-sm italic text-gray-500 mt-1">
                    and more...
                  </span>
                )}
              </div>
            </div>
            {/* Buttons */}
            <div className="mt-5">
              <button
                className="py-2 px-3 bg-green-500 rounded-xl text-white hover:bg-green-300 border-black border"
                onClick={handleWatchlist}
              >
                Add to Watchlist
              </button>
              <button
                className="ml-2 py-2 px-3 bg-orange-500 rounded-xl text-white hover:bg-orange-300 border border-black"
                onClick={handleRate}
              >
                Already seen? Rate Movie
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MovieDetails;
