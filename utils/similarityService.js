const Movie = require("../models/Movies");

// Calculate similarity scores
const calculateGenreSimilarity = (userRatings, movie) => {
  let totalScore = 0;
  let totalWeight = 0;

  userRatings.forEach(({ ratedMovie, rating }) => {
    const weight = rating / 10; // Scale weight by user rating (higher ratings = more influence)
    const overlap = ratedMovie.genre.filter((genre) =>
      movie.genre.includes(genre)
    ).length;

    const genreScore = (overlap / ratedMovie.genre.length) * weight;
    totalScore += genreScore;
    totalWeight += weight;
  });

  return totalWeight > 0 ? totalScore / totalWeight : 0;
};

const calculateActorSimilarity = (userRatings, movie) => {
  let totalScore = 0;
  let totalWeight = 0;

  userRatings.forEach(({ ratedMovie, rating }) => {
    const weight = rating / 10;
    const overlap = ratedMovie.actors.filter((actor) =>
      movie.actors.includes(actor)
    ).length;

    const actorScore = (overlap / ratedMovie.actors.length) * weight;
    totalScore += actorScore;
    totalWeight += weight;
  });

  return totalWeight > 0 ? totalScore / totalWeight : 0;
};

const calculateKeywordSimilarity = (userRatings, movie) => {
  let totalScore = 0;
  let totalWeight = 0;

  userRatings.forEach(({ ratedMovie, rating }) => {
    const weight = rating / 10;
    const overlap = ratedMovie.keywords.filter((keyword) =>
      movie.keywords.includes(keyword)
    ).length;

    const keywordScore = (overlap / ratedMovie.keywords.length) * weight;
    totalScore += keywordScore;
    totalWeight += weight;
  });

  return totalWeight > 0 ? totalScore / totalWeight : 0;
};

const calculateDirectorSimilarity = (userRatings, movie) => {
  let totalScore = 0;
  let totalWeight = 0;

  userRatings.forEach(({ ratedMovie, rating }) => {
    const weight = rating / 10;
    const directorMatch = ratedMovie.director === movie.director ? weight : 0;
    totalScore += directorMatch;
    totalWeight += weight;
  });

  return totalWeight > 0 ? totalScore / totalWeight : 0;
};

const calculateOverallSimilarity = (userRatings, movie) => {
  const genreScore = calculateGenreSimilarity(userRatings, movie);
  const actorScore = calculateActorSimilarity(userRatings, movie);
  const keywordScore = calculateKeywordSimilarity(userRatings, movie);
  const directorScore = calculateDirectorSimilarity(userRatings, movie);

  // Adjusted weights based on industry insights
  const actorWeight = 0.35;
  const directorWeight = 0.3;
  const keywordWeight = 0.2;
  const genreWeight = 0.15;

  return (
    actorScore * actorWeight +
    directorScore * directorWeight +
    keywordScore * keywordWeight +
    genreScore * genreWeight
  );
};

// Filter movies
const getFilteredMovies = async (userRatings, allMovies) => {
  const ratedMovieIds = userRatings.map(({ ratedMovie }) => ratedMovie.tmdb_id);

  return allMovies.filter(
    (movie) =>
      !ratedMovieIds.includes(movie.tmdb_id) && // Exclude rated movies
      movie.genre.length > 0 // Ensure movie has genres
  );
};

// Generate recommendations
const generateRecommendations = async (userRatings, allMovies) => {
  const recommendedMovies = new Set();
  const ratedMovieIds = userRatings.map(({ ratedMovie }) => ratedMovie.tmdb_id);

  const MIN_GENERAL = 20;
  const MIN_GENRE = 15;
  const MIN_ACTORS = 20;

  const getUniqueMovies = (movies, limit, scoreKey) => {
    const uniqueMovies = movies
      .filter(
        (movie) =>
          movie &&
          movie.tmdb_id &&
          movie.title &&
          !recommendedMovies.has(movie.tmdb_id)
      )
      .sort((a, b) => b[scoreKey] - a[scoreKey])
      .slice(0, limit);

    uniqueMovies.forEach((movie) => recommendedMovies.add(movie.tmdb_id));
    return uniqueMovies;
  };

  // Calculate similarities for all movies
  const allMovieScores = allMovies.map((movie) => {
    const similarityScore = calculateOverallSimilarity(userRatings, movie);
    return { ...movie, similarityScore };
  });

  // General Recommendations
  let generalRecommendations = getUniqueMovies(
    allMovieScores,
    MIN_GENERAL,
    "similarityScore"
  );

  // Genre-specific Recommendations
  const genreRecommendations = {};
  const topGenres = Array.from(
    new Set(userRatings.flatMap(({ ratedMovie }) => ratedMovie.genre || []))
  ).slice(0, 3);

  for (const genre of topGenres) {
    const genreMovies = allMovieScores
      .filter((movie) => (movie.genre || []).includes(genre))
      .map((movie) => ({
        ...movie,
        genreScore: calculateGenreSimilarity(userRatings, movie),
      }));

    genreRecommendations[genre] = getUniqueMovies(
      genreMovies,
      MIN_GENRE,
      "genreScore"
    );
  }

  // Actor-specific Recommendations
  const actorMovies = allMovieScores
    .filter((movie) =>
      (movie.actors || []).some((actor) =>
        userRatings.some(({ ratedMovie }) =>
          (ratedMovie.actors || []).includes(actor)
        )
      )
    )
    .map((movie) => ({
      ...movie,
      actorScore: calculateActorSimilarity(userRatings, movie),
    }));

  let actorRecommendations = getUniqueMovies(
    actorMovies,
    MIN_ACTORS,
    "actorScore"
  );

  // Fill under-filled carousels
  const remainingMovies = allMovies.filter(
    (movie) => !recommendedMovies.has(movie.tmdb_id)
  );

  if (generalRecommendations.length < MIN_GENERAL) {
    const additionalGeneral = getUniqueMovies(
      remainingMovies,
      MIN_GENERAL - generalRecommendations.length,
      "popularity"
    );
    generalRecommendations = [...generalRecommendations, ...additionalGeneral];
  }

  for (const genre of topGenres) {
    if (genreRecommendations[genre].length < MIN_GENRE) {
      const additionalGenreMovies = getUniqueMovies(
        remainingMovies,
        MIN_GENRE - genreRecommendations[genre].length,
        "popularity"
      );
      genreRecommendations[genre] = [
        ...genreRecommendations[genre],
        ...additionalGenreMovies,
      ];
    }
  }

  if (actorRecommendations.length < MIN_ACTORS) {
    const additionalActorMovies = getUniqueMovies(
      remainingMovies,
      MIN_ACTORS - actorRecommendations.length,
      "popularity"
    );
    actorRecommendations = [...actorRecommendations, ...additionalActorMovies];
  }

  // Return all recommendations
  return {
    general: generalRecommendations,
    genres: genreRecommendations,
    actors: actorRecommendations,
  };
};

module.exports = {
  calculateGenreSimilarity,
  calculateActorSimilarity,
  calculateKeywordSimilarity,
  calculateDirectorSimilarity,
  calculateOverallSimilarity,
  getFilteredMovies,
  generateRecommendations,
};
