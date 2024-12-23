import React from "react";
import Movie from "./MovieComponent";

function MovieCarousel({ title, movies }) {
  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold mb-3">{title}</h2>
      <div className="flex overflow-x-scroll space-x-4 scrollbar-hide">
        {movies.map((movie) => (
          <Movie key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  );
}

export default MovieCarousel;
