import React, { useState } from "react";

function MovieWithRating({ movie, onRatingChange }) {
  const [rating, setRating] = useState(5);
  const [selected, setSelected] = useState(false);
  const handleSliderChange = (e) => {
    const newRating = e.target.value;
    setRating(newRating);
    onRatingChange(movie.tmdb_id, newRating);
  };

  const handleClick = () => {
    if (selected) {
      setRating(0);
      onRatingChange(movie.tmdb_id, 0);
    } else {
      setRating(5);
      onRatingChange(movie.tmdb_id, 5);
    }
    setSelected(!selected);
  };

  return (
    <div className="flex flex-col items-center justify-start w-[120px]">
      <img
        src={movie.posterURL}
        alt={movie.title}
        className={`w-[100px] h-[150px] rounded transition-transform transform ${
          selected ? "scale-105 border-prim-blue-p border-4" : "scale-100"
        }`}
        onClick={handleClick}
      />
      <h3 className="mt-2 text-center text-xs sm:text-sm max-w-[100px] truncate">
        {movie.title}
      </h3>
      {selected && (
        <div className="flex flex-col items-center mt-1 w-full">
          <input
            type="range"
            min="1"
            max="10"
            value={rating}
            onChange={handleSliderChange}
            className="w-[85%] sm:w-[90%]"
          />
        </div>
      )}
    </div>
  );
}
export default MovieWithRating;
