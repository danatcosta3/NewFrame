import React, { useState } from "react";
import apiClient from "../apiClient";
function RateMovieModal({ handleCloseRate, movieId, handleCloseRateWO }) {
  const [rating, setRating] = useState(3);

  const handleSliderChange = (e) => {
    const newRating = e.target.value;
    setRating(newRating);
  };

  const handleSubmit = async (ratingValue) => {
    try {
      const response = await apiClient.post("/saveRating", {
        movieRatings: [{ tmdb_id: movieId, rating: ratingValue }],
      });

      if (response.status === 200) {
        handleCloseRate();
      } else {
        alert("Failed to sbumit rating.");
      }
    } catch (error) {
      console.error("Error submitting rating:", error);
      alert("Error Submitting rating.");
    }
  };
  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
      <div className="bg-white bg-opacity-95 w-1/2 h-1/4 rounded-lg shadow-lg flex flex-col p-8">
        <div className="flex flex-row justify-between w-full">
          <h2 className="text-lg w-full">Rating:</h2>
          <img
            src="/images/CloseIcon.png"
            alt="X"
            className="mr-3 w-8 h-8 hover:bg-red-200 rounded"
            onClick={handleCloseRateWO}
          />
        </div>
        <div className="flex flex-col items-center mt-7 w-full ">
          <input
            type="range"
            min="1"
            max="10"
            value={rating}
            onChange={handleSliderChange}
            className="w-full"
          />
          <button
            className="bg-prim-blue-p text-white px-3 py-2 rounded-lg hover:bg-blue-400  mt-10"
            onClick={() => handleSubmit(rating)}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}

export default RateMovieModal;
