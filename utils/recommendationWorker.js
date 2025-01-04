const { parentPort } = require("worker_threads");
const mongoose = require("mongoose");
const { ObjectId } = require("bson");
const User = require("../models/Users");
const Movie = require("../models/Movies");
const { generateRecommendations } = require("./similarityService");

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
    });
    console.log("Worker: Connected to MongoDB");
  } catch (error) {
    console.error("Worker: Failed to connect to MongoDB", error);
    process.exit(1); // Exit worker if connection fails
  }
})();

parentPort.on("message", async (userId) => {
  try {
    console.log(`Worker: Starting recommendations for user ${userId}...`);

    if (!ObjectId.isValid(userId)) {
      throw new Error("Invalid userId format");
    }
    const objectId = new ObjectId(userId);

    const user = await User.findById(objectId);
    if (!user) throw new Error("User not found");

    console.log("Worker: Fetching all movies for recommendations...");
    const allMovies = await Movie.find({
      title: { $not: /2|Part|Chapter|III|IV|V/i }, // Avoid sequels
    });

    console.log(`Worker: Found ${allMovies.length} movies to process.`);

    // Prepare user ratings for recommendation calculation
    const ratedMovies = await Promise.all(
      user.movieRatings.map(async ({ tmdb_id, rating }) => {
        const movie = await Movie.findOne({ tmdb_id });
        return movie ? { ratedMovie: movie, rating } : null;
      })
    );
    const userRatings = ratedMovies.filter((entry) => entry !== null);

    console.log("Worker: Generating recommendations...");
    const recommendations = await generateRecommendations(
      userRatings,
      allMovies
    );

    // Save updated recommendations
    user.recommendations = {
      ...recommendations,
      lastUpdated: new Date(),
    };
    await user.save();

    console.log(
      `Worker: Recommendations updated successfully for user ${user._id}`
    );
    parentPort.postMessage({ status: "success" });
  } catch (error) {
    console.error("Worker: Error generating recommendations:", error);
    parentPort.postMessage({ status: "error", error });
  }
});
