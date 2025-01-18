const calculateSimilarity = (userRatings, movie, weightFactors) => {
  if (!movie.genre || !movie.actors || !movie.keywords) {
    return 0; // Skip invalid movies
  }

  let totalScore = 0;
  let totalWeight = 0;

  userRatings.forEach(({ ratedMovie, rating }) => {
    const weight = rating / 10;

    const genreOverlap = (ratedMovie.genre || []).filter((g) =>
      (movie.genre || []).includes(g)
    ).length;
    const actorOverlap = (ratedMovie.actors || []).filter((a) =>
      (movie.actors || []).includes(a)
    ).length;
    const keywordOverlap = (ratedMovie.keywords || []).filter((k) =>
      (movie.keywords || []).includes(k)
    ).length;
    const directorMatch = ratedMovie.director === movie.director ? 1 : 0;

    const genreScore =
      (genreOverlap / Math.max(ratedMovie.genre.length, 1)) *
      weightFactors.genre;
    const actorScore =
      (actorOverlap / Math.max(ratedMovie.actors.length, 1)) *
      weightFactors.actor;
    const keywordScore =
      (keywordOverlap / Math.max(ratedMovie.keywords.length, 1)) *
      weightFactors.keyword;
    const directorScore = directorMatch * weightFactors.director;

    const similarityScore =
      (genreScore + actorScore + keywordScore + directorScore) * weight;

    totalScore += similarityScore;
    totalWeight += weight;
  });

  return totalWeight > 0 ? totalScore / totalWeight : 0;
};

const generateRecommendations = async (userRatings, allMovies) => {
  const weightFactors = {
    genre: 0.3,
    actor: 0.4,
    keyword: 0.2,
    director: 0.1,
  };

  const recommendedMovies = new Set();
  const ratedMovieIds = userRatings.map(({ ratedMovie }) => ratedMovie.tmdb_id);

  const scoredMovies = allMovies
    .filter((movie) => movie.genre && !ratedMovieIds.includes(movie.tmdb_id))
    .map((movie) => ({
      ...movie._doc,
      similarityScore: calculateSimilarity(userRatings, movie, weightFactors),
    }));

  scoredMovies.sort((a, b) => b.similarityScore - a.similarityScore);

  // General Recommendations
  const generalRecommendations = scoredMovies
    .filter((movie) => !recommendedMovies.has(movie.tmdb_id))
    .slice(0, 20);
  generalRecommendations.forEach((movie) =>
    recommendedMovies.add(movie.tmdb_id)
  );

  // Genre-Specific Recommendations
  const genreRecommendations = {};
  const topGenres = userRatings
    .flatMap(({ ratedMovie }) => ratedMovie.genre || [])
    .reduce((acc, genre) => {
      acc[genre] = (acc[genre] || 0) + 1;
      return acc;
    }, {});

  const sortedGenres = Object.keys(topGenres).sort(
    (a, b) => topGenres[b] - topGenres[a]
  );

  sortedGenres.slice(0, 3).forEach((genre) => {
    const genreMovies = scoredMovies
      .filter(
        (movie) =>
          movie.genre.includes(genre) && !recommendedMovies.has(movie.tmdb_id)
      )
      .slice(0, 15);
    genreRecommendations[genre] = genreMovies;
    genreMovies.forEach((movie) => recommendedMovies.add(movie.tmdb_id));
  });

  // Actor-Specific Recommendations
  const actorRecommendations = scoredMovies
    .filter(
      (movie) =>
        (movie.actors || []).some((actor) =>
          userRatings.some(({ ratedMovie }) =>
            (ratedMovie.actors || []).includes(actor)
          )
        ) && !recommendedMovies.has(movie.tmdb_id)
    )
    .slice(0, 20);
  actorRecommendations.forEach((movie) => recommendedMovies.add(movie.tmdb_id));

  return {
    general: generalRecommendations,
    genres: genreRecommendations,
    actors: actorRecommendations,
  };
};

module.exports = { generateRecommendations };
