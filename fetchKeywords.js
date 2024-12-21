const axios = require("axios");
const mongoose = require("mongoose");
const Movie = require("./models/Movies");
require("dotenv").config();

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const MONGO_URI = process.env.MONGO_URI;

//USED THIS SCRIPT TO POPULATE MOVIE KEYWORDS IN DB
//USING ANOTHER SCRIPT TO POPULATE MOVIES, ACTORS, DIRECTORS

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    fetchKeywords();
  })
  .catch((err) => console.error("Error connecting to MongoDB:", err));

async function fetchKeywords() {
  const allMovies = await Movie.find({}).exec();
  const allMoviesLength = allMovies.length;
  let moviesFetched = 0;

  for (const movie of allMovies) {
    try {
      const movie_ID = movie.tmdb_id;

      console.log(`Fetching keywords for movie: ${movie.title} `);
      const response = await axios.get(
        `https://api.themoviedb.org/3/movie/${movie_ID}/keywords`,
        {
          params: {
            api_key: TMDB_API_KEY,
            language: "en-US",
          },
        }
      );
      const keywordArr = response.data.keywords.map((keyword) => keyword.name);

      await Movie.updateOne(
        { tmdb_id: movie_ID },
        { $set: { keywords: keywordArr } }
      );
      moviesFetched++;
      console.log(
        `Keywords updated for: ${movie.title} ${Math.floor(
          (moviesFetched / allMoviesLength) * 100
        )}% complete`
      );
    } catch (error) {
      console.error("Error fetching keywords for movie:", movie.title, error);
    }
  }
  console.log(`Finished fetching keywords for ${moviesFetched} movies.`);
  process.exit();
}
