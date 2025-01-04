const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  dateCreated: {
    type: Date,
    default: Date.now,
  },
  refreshToken: { type: String },
  name: { type: String },
  profileSetupComplete: { type: Boolean, default: false },
  movieRatings: [
    {
      tmdb_id: { type: Number, required: true },
      rating: { type: Number, required: true },
    },
  ],
  watchlist: {
    type: [Number],
    default: [],
    required: true,
  },
  recommendations: {
    general: Array,
    actors: Array,
    genres: Object,
    lastUpdated: Date,
  },
});

module.exports = mongoose.model("User", userSchema);
