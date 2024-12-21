const axios = require("axios");
const mongoose = require("mongoose");
const Movie = require("./models/Movies");
require("dotenv").config();

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const MONGO_URI = process.env.MONGO_URI;

//USED THIS SCRIPT TO POPULATE MOVIES IN DB
//USING ANOTHER SCRIPT TO POPULATE KEYWORDS, ACTORS, DIRECTORS

const genreMap = {
  28: "Action",
  12: "Adventure",
  16: "Animation",
  35: "Comedy",
  80: "Crime",
  99: "Documentary",
  18: "Drama",
  10751: "Family",
  14: "Fantasy",
  36: "History",
  27: "Horror",
  10402: "Music",
  9648: "Mystery",
  10749: "Romance",
  878: "Science Fiction",
  10770: "TV Movie",
  53: "Thriller",
  10752: "War",
  37: "Western",
};

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    fetchMovies();
  })
  .catch((err) => console.error("Error connecting to MongoDB:", err));

async function fetchMovies() {
  let page = 1;
  const totalPages = 501;
  let moviesFetched = 0;

  while (page < totalPages) {
    try {
      console.log(`Fetching page ${page}...`);

      const response = await axios.get(
        `https://api.themoviedb.org/3/movie/popular`,
        {
          params: {
            api_key: TMDB_API_KEY,
            page: page,
            language: "en-US",
          },
        }
      );

      for (const movie of response.data.results) {
        const movieGenres = movie.genre_ids.map(
          (id) => genreMap[id] || "Unknown"
        );

        const movieData = {
          title: movie.title,
          tmdb_id: movie.id,
          genre: movieGenres,
          releaseDate: movie.release_date ? new Date(movie.release_date) : null,
          posterURL: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
          description: movie.overview || "No description available",
          keywords: [],
        };

        const existingMovie = await Movie.findOne({ tmdb_id: movie.id });
        if (!existingMovie) {
          await Movie.create(movieData);
          moviesFetched++;
          console.log(`Added movie: ${movie.title}`);
        } else {
          console.log(`Movie already exists: ${movie.title}`);
        }
      }

      page++;
      if (response.data.results.length === 0) {
        console.log("No more movies available. Stopping fetch.");
        break;
      }
    } catch (error) {
      console.error("Error fetching movie data:", error);
      break;
    }
  }
  console.log(`Finished fetching ${moviesFetched} movies.`);
  process.exit();
}
