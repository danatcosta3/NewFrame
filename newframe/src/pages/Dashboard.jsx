import React, { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import ProfileSetupModal from "../components/ProfileSetupModal";
import RatingModal from "../components/RatingModal";
import SearchBar from "../components/SearchBar";
import MovieCarousel from "../components/MovieCarousel";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import apiClient from "../apiClient";

function Dashboard() {
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  const [general, setGeneral] = useState([]);
  const [actors, setActors] = useState([]);
  const [genres, setGenres] = useState({});
  const [isFetchingRecommendations, setIsFetchingRecommendations] =
    useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await apiClient.get("/profile");
        const { profileSetupComplete } = response.data;

        if (!profileSetupComplete) {
          setShowProfileModal(true);
        } else {
          fetchRecommendations();
        }
      } catch (error) {
        console.error("Error fetching user data in dashboard: ", error);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchTrendingMovies = async () => {
      try {
        const response = await apiClient.get("/movies/trending");
        setTrendingMovies(response.data || []);
      } catch (error) {
        console.error("Error fetching trending movies:", error);
      }
    };

    fetchTrendingMovies();
  }, []);

  const fetchRecommendations = async (retryCount = 0) => {
    if (retryCount === 0) setIsFetchingRecommendations(true);

    try {
      const response = await apiClient.get("/recommendations");

      const { status, general = [], genres = {}, actors = [] } = response.data;

      if (status === "ready") {
        setGeneral(general);
        setGenres(genres);
        setActors(actors);
        setIsFetchingRecommendations(false);
      } else if (status === "loading") {
        setGeneral(general);
        setGenres(genres);
        setActors(actors);

        if (retryCount < 10) {
          setTimeout(() => fetchRecommendations(retryCount + 1), 5000);
        } else {
          console.warn("Failed to fetch recommendations after retries.");
          setIsFetchingRecommendations(false);
        }
      }
    } catch (error) {
      console.error("Error fetching recommendations:", error);
      setIsFetchingRecommendations(false);
    }
  };

  useEffect(() => {
    const fetchWatchlist = async () => {
      try {
        const response = await apiClient.get("/watchlist/get");
        setWatchlist(response.data);
      } catch (error) {
        console.log("Error fetching watchlist: ", error);
      }
    };
    fetchWatchlist();
  }, []);

  const handleProfileSubmit = () => {
    setShowProfileModal(false);
    setShowRatingModal(true);
  };

  const handleRatingSubmit = () => {
    setShowRatingModal(false);
    fetchRecommendations();
  };

  const handleSearch = (movie) => {
    if (movie && movie.tmdb_id) {
      navigate(`/movies/${movie.tmdb_id}`);
    } else {
      console.error("Invalid movie object:", movie);
    }
  };

  return (
    <div className="min-h-screen">
      {showProfileModal && <ProfileSetupModal onSubmit={handleProfileSubmit} />}
      {showRatingModal && !showProfileModal && (
        <RatingModal onSubmit={handleRatingSubmit} />
      )}
      {isFetchingRecommendations &&
        general.length === 0 &&
        actors.length === 0 &&
        Object.keys(genres).length === 0 && (
          <div className="loading-modal">
            <p>Loading recommendations...</p>
          </div>
        )}
      {!showProfileModal && !showRatingModal && (
        <div className="flex overflow-x-hidden">
          <NavBar />
          <div className="flex-1 ml-[20%] pt-5 pl-4">
            <SearchBar onSearch={handleSearch} />
            <div className="mt-5">
              <MovieCarousel
                title="For You"
                movies={general.filter((movie) => movie?.tmdb_id)}
                nav={`/category/explore`}
              />
              <MovieCarousel
                title="Trending"
                movies={trendingMovies}
                nav={`/category/trending`}
              />
              <MovieCarousel
                title="Movies With Actors You Like"
                movies={actors.filter((movie) => movie?.tmdb_id)}
                nav={`/category/actors`}
              />
              {Object.entries(genres).map(([genre, movies]) => (
                <MovieCarousel
                  key={genre}
                  title={`${genre} Movies`}
                  movies={movies.filter((movie) => movie?.tmdb_id)}
                  nav={`/category/${genre}`}
                />
              ))}
              <MovieCarousel title="Your Watchlist" movies={watchlist} />
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}

export default Dashboard;
