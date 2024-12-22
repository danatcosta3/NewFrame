import React, { useState } from "react";

function Movie({ movie, onRatingChange }) {
  const [rating, setRating] = useState(5);
  const [selected, setSelected] = useState(false);
  const handleSliderChange = (e) => {
    const newRating = e.target.value;
    setRating(newRating);
    onRatingChange(movie.tmdb_id, newRating);
  };

  return (
    <div className="movie flex flex-col justify-center items-center relative">
      <img
        src={movie.posterURL}
        alt={movie.title}
        className={`w-[100px] h-[133px] rounded transition-all duration-200 ease-in-out ${
          selected ? "border-prim-blue-p border-4 rounded" : ""
        }`}
        onClick={() => setSelected(!selected)}
      />
      <h3 className="items-center">{movie.title}</h3>
      {selected && (
        <div className="absolute top-[160px] w-full flex flex-col items-center">
          <input
            type="range"
            min="1"
            max="10"
            value={rating}
            onChange={handleSliderChange}
            className="w-[85px]"
          />
          <div>Rating: {rating}</div>
        </div>
      )}
    </div>
  );
}

export default Movie;
