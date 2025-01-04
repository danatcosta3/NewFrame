const mongoose = require("mongoose");

const TrendingSchema = new mongoose.Schema({
  movies: [
    {
      tmdb_id: Number,
      title: String,
      posterURL: String,
      description: String,
      genre: [String],
      release_date: String,
      popularity: Number,
    },
  ],
  lastUpdated: {
    type: Date,
    default: null,
  },
});

module.exports = mongoose.model("Trending", TrendingSchema);
