import React, { useRef, useEffect, useState } from "react";
import Movie from "./MovieComponent";

function MovieCarousel({ title, movies }) {
  const carouselRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(0);

  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({
        left: -300, // Scroll left by 300px
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({
        left: 300, // Scroll right by 300px
        behavior: "smooth",
      });
    }
  };

  // Dynamically adjust the container width
  useEffect(() => {
    const updateWidth = () => {
      if (carouselRef.current) {
        const parentWidth = carouselRef.current.parentNode.offsetWidth;
        const buttonWidth = 50; // Fixed width for each button
        const padding = 16; // Account for padding
        const calculatedWidth = parentWidth - buttonWidth * 2 - padding * 2;
        setContainerWidth(calculatedWidth > 0 ? calculatedWidth : 0);
      }
    };

    updateWidth(); // Calculate on load
    window.addEventListener("resize", updateWidth); // Recalculate on resize
    return () => window.removeEventListener("resize", updateWidth); // Cleanup
  }, []);

  return (
    <div className="mb-6 bg-prim-offwhite px-4 py-4 rounded-3xl hover:ring-2 ring-prim-blue-p">
      {/* Title */}
      <h2 className="text-2xl font-bold mb-4 text-prim-blue-p">{title}</h2>

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
          className="flex overflow-x-scroll py-2 overflow-y-hidden gap-2 scrollbar-hide scroll-smooth"
          style={{
            maxWidth: `${containerWidth}px`,
          }}
        >
          {movies.map((movie, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-[100px] h-[160px] hover:scale-105 transform transition duration-200"
            >
              <Movie movie={movie} />
            </div>
          ))}
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
