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
});

module.exports = mongoose.model("User", userSchema);
