import React from "react";
import { useNavigate } from "react-router-dom";

function MovieComponent({ movie }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/movies/${movie.tmdb_id}`);
  };

  return (
    <div
      className="flex flex-col items-center justify-start m-0 p-0 w-[120px] flex-shrink-0"
      onClick={handleClick}
    >
      <img
        src={movie.posterURL}
        alt={movie.title}
        className="w-[100px] h-[150px] rounded m-0 p-0 transition-transform transform scale-100 border border-black"
      />
    </div>
  );
}

export default MovieComponent;
