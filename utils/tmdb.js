const axios = require("axios");

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

const fetchTrendingMovies = async () => {
  try {
    const response = await axios.get(`${TMDB_BASE_URL}/trending/movie/week`, {
      params: {
        api_key: TMDB_API_KEY,
      },
    });

    return response.data.results;
  } catch (error) {
    console.error("Error fetching trending movies from TMDB:", error);
    throw new Error("Failed to fetch trending movies.");
  }
};

module.exports = {
  fetchTrendingMovies,
};
