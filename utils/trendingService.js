const Trending = require("../models/Trending");
const Movie = require("../models/Movies");
const { fetchTrendingMovies } = require("./tmdb");
const axios = require("axios");

const TMDB_API_KEY = process.env.TMDB_API_KEY;

// Fetch additional details for a movie
const fetchMovieDetails = async (tmdbId) => {
  try {
    const [creditsResponse, keywordsResponse] = await Promise.all([
      axios.get(`https://api.themoviedb.org/3/movie/${tmdbId}/credits`, {
        params: { api_key: TMDB_API_KEY },
      }),
      axios.get(`https://api.themoviedb.org/3/movie/${tmdbId}/keywords`, {
        params: { api_key: TMDB_API_KEY },
      }),
    ]);

    // Extract actors, director, and keywords
    const actors = creditsResponse.data.cast.map((actor) => actor.name);
    const director =
      creditsResponse.data.crew.find((person) => person.job === "Director")
        ?.name || "Unknown";
    const keywords = keywordsResponse.data.keywords.map(
      (keyword) => keyword.name
    );

    return { actors, director, keywords };
  } catch (error) {
    console.error(`Error fetching details for movie ${tmdbId}:`, error);
    return { actors: [], director: "Unknown", keywords: [] };
  }
};

// Main trending movies function
const getOrUpdateTrendingMovies = async () => {
  try {
    const existingTrending = await Trending.findOne();

    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    if (existingTrending && existingTrending.lastUpdated > oneWeekAgo) {
      return existingTrending.movies;
    }

    console.log("Fetching new trending movies from TMDB...");
    const tmdbMovies = await fetchTrendingMovies();

    const formattedMovies = await Promise.all(
      tmdbMovies.map(async (movie) => {
        let existingMovie = await Movie.findOne({ tmdb_id: movie.id });

        if (!existingMovie) {
          console.log(`Adding new movie to database: ${movie.title}`);
          const { actors, director, keywords } = await fetchMovieDetails(
            movie.id
          );

          existingMovie = new Movie({
            tmdb_id: movie.id,
            title: movie.title,
            posterURL: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
            description: movie.overview || "No description available.",
            genre: movie.genre_ids || [],
            release_date: movie.release_date,
            popularity: movie.popularity,
            actors,
            director,
            keywords,
          });
          await existingMovie.save();
        }

        return {
          tmdb_id: existingMovie.tmdb_id,
          title: existingMovie.title,
          posterURL: existingMovie.posterURL,
          description: existingMovie.description,
          genre: existingMovie.genre,
          release_date: existingMovie.release_date,
          popularity: existingMovie.popularity,
        };
      })
    );

    if (existingTrending) {
      existingTrending.movies = formattedMovies;
      existingTrending.lastUpdated = new Date();
      await existingTrending.save();
    } else {
      await Trending.create({
        movies: formattedMovies,
        lastUpdated: new Date(),
      });
    }

    return formattedMovies;
  } catch (error) {
    console.error("Error in getOrUpdateTrendingMovies:", error);
    throw new Error("Failed to get or update trending movies.");
  }
};

module.exports = {
  getOrUpdateTrendingMovies,
};
