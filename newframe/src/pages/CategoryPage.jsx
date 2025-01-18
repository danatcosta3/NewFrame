import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import apiClient from "../apiClient";

function CategoryPage() {
  const { genre } = useParams();
  const [title, setTitle] = useState(genre);
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    if (!genre) {
      navigate("/dashboard");
      return;
    } else if (title === "trending") {
      setTitle("Trending");
    } else if (title === "actors") {
      setTitle("Similar Actor");
    } else if (title === "explore") {
      setTitle("Explore");
    }

    const fetchMovies = async () => {
      try {
        let endpoint = "";

        if (genre === "trending") {
          endpoint = "/movies/trending";
        } else if (genre === "actors") {
          endpoint = "/movies/actors";
        } else if (genre === "explore") {
          endpoint = "/movies/explore";
        } else {
          endpoint = `/movies/genre/${genre}`;
        }

        const response = await apiClient.get(endpoint);
        setMovies(response.data);
      } catch (err) {
        if (err.response?.status === 403) {
          navigate("/dashboard");
        } else {
          setError(`Failed to fetch ${genre} movies.`);
        }
      }
    };

    fetchMovies();
  }, [genre, navigate]);

  const handleMovieClick = (tmdb_id) => {
    navigate(`/movies/${tmdb_id}`);
  };

  return (
    <div className="min-h-screen">
      <div className="flex overflow-x-hidden">
        <NavBar />
        <div className="flex-1 ml-[20%] pt-5 pl-4">
          <h1 className="mt-4 font-bold text-3xl">{title} Movies:</h1>
          <div>
            {error ? (
              <p className="text-red-500">{error}</p>
            ) : movies && movies.length > 0 ? (
              movies.map((movie) => (
                <div key={movie.tmdb_id} className="mt-5 py-3">
                  <div className="flex">
                    <div
                      className="flex-shrink-0 w-[100px] h-[160px] hover:scale-105 transform transition duration-200"
                      onClick={() => handleMovieClick(movie.tmdb_id)}
                    >
                      <img src={movie.posterURL} alt={movie.title} />
                    </div>
                    <div className="ml-3">
                      <h1 className="text-lg font-semibold">{movie.title}</h1>
                      <p className="italic mt-3">{movie.description}</p>
                    </div>
                  </div>
                  <hr className="border" />
                </div>
              ))
            ) : (
              <p className="text-gray-500">Loading movies...</p>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default CategoryPage;
