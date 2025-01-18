import React, { useRef, useEffect, useState } from "react";
import Movie from "./MovieComponent";
import { Link } from "react-router-dom";

function MovieCarousel({ title, movies, nav }) {
  const carouselRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(0);

  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({
        left: -300,
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({
        left: 300,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    const updateWidth = () => {
      if (carouselRef.current) {
        const parentWidth = carouselRef.current.parentNode.offsetWidth;
        const buttonWidth = 50;
        const padding = 16;
        const calculatedWidth = parentWidth - buttonWidth * 2 - padding * 2;
        setContainerWidth(calculatedWidth > 0 ? calculatedWidth : 0);
      }
    };

    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  return (
    <div className="mb-6 bg-prim-offwhite px-4 py-4 rounded-3xl hover:ring-2 ring-prim-blue-p">
      {/* Title */}
      <Link to={nav}>
        <h2 className="text-2xl font-bold mb-4 text-prim-blue-p hover:underline hover:underline-prim-blue-p">
          {title}
        </h2>
      </Link>
      {/* Carousel Layout */}
      <div className="flex items-center justify-between">
        {/* Left Button */}
        <button
          onClick={scrollLeft}
          className="bg-black bg-opacity-50 text-white rounded-full w-12 h-12 flex items-center justify-center hover:bg-opacity-75 flex-shrink-0"
        >
          {"<"}
        </button>

        {/* Movie Scroll Area */}
        <div
          ref={carouselRef}
          className="flex overflow-x-scroll py-2 overflow-y-hidden gap-2 scrollbar-hide scroll-smooth w-full"
          style={{
            maxWidth: `${containerWidth}px`,
          }}
        >
          {movies && movies.length > 0 ? (
            movies.map((movie) => (
              <div
                key={movie.tmdb_id}
                className="flex-shrink-0 w-[100px] h-[160px] hover:scale-105 transform transition duration-200"
              >
                <Movie movie={movie} />
              </div>
            ))
          ) : (
            <p className="text-gray-500">Empty...</p>
          )}
        </div>

        {/* Right Button */}
        <button
          onClick={scrollRight}
          className="bg-black bg-opacity-50 text-white rounded-full w-12 h-12 flex items-center justify-center hover:bg-opacity-75 flex-shrink-0"
        >
          {">"}
        </button>
      </div>
    </div>
  );
}

export default MovieCarousel;
