const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    //unique: true,
  },
  tmdb_id: {
    type: Number,
    unique: true,
  },
  genre: {
    type: [String],
    default: [],
  },
  actors: {
    type: [String],
    default: [],
  },
  releaseDate: {
    type: Date,
  },
  posterURL: {
    type: String,
  },
  description: {
    type: String,
  },
  keywords: {
    type: [String],
    default: [],
  },
  director: {
    type: String,
    default: "Unknown",
  },
});

module.exports = mongoose.model("Movie", movieSchema);
