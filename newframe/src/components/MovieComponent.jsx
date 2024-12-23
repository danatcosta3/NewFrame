import React from "react";

function MovieComponent({ movie }) {
  return (
    <div className="flex flex-col items-center justify-start w-[120px]">
      <img
        src={movie.posterURL}
        alt={movie.title}
        className="w-[100px] h-[150px] rounded transition-transform transform scale-100"
      />
    </div>
  );
}

export default MovieComponent;
