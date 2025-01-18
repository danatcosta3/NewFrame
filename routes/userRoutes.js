const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/Users");
const authenticateToken = require("../middleware/authMiddleware");
const Movie = require("../models/Movies");
const router = express.Router();
const { getOrUpdateTrendingMovies } = require("../utils/trendingService");
const { generateRecommendations } = require("../utils/similarityService");

const { Worker } = require("worker_threads");
const path = require("path");

router.post("/register", async (req, res) => {
  const { email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, password: hashedPassword });

    //Generate tokens
    const accessToken = jwt.sign(
      { id: newUser._id, email: newUser.email },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      { id: newUser._id, email: newUser.email },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );

    newUser.refreshToken = refreshToken;
    await newUser.save();

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({ message: "User created successfully", accessToken });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Login User
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: "Invalid password" });
    }

    //Generate tokens
    const accessToken = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      { id: user._id, email: user.email },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );

    user.refreshToken = refreshToken;
    await user.save();

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ message: "Login successful", accessToken });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/profile", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({
      email: user.email,
      id: user._id,
      profileSetupComplete: user.profileSetupComplete,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/refresh", async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ message: "No refresh token provided" });
    }

    const user = await User.findOne({ refreshToken });
    if (!user) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (err, decoded) => {
        if (err) {
          return res.status(403).json({ message: "Invalid refresh token" });
        }

        const accessToken = jwt.sign(
          { id: user._id, email: user.email },
          process.env.JWT_SECRET,
          { expiresIn: "15m" }
        );
        res.status(200).json({ accessToken });
      }
    );
  } catch (error) {
    console.error("Error in /refresh:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/logout", async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(204).json({ message: "No content" });
    }

    const user = await User.findOne({ refreshToken });
    if (!user) {
      return res.status(204).json({ message: "No content" });
    }

    user.refreshToken = null;
    await user.save();

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error("Error in /logout: ", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/setUserName", async (req, res) => {
  const { name } = req.body;
  if (!name || name.trim().length < 1 || name.length > 50) {
    return res.status(400).json({ message: "Invalid name" });
  }
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(204).json({ message: "No content" });
    }

    const user = await User.findOne({ refreshToken });
    if (!user) {
      return res.status(204).json({ message: "No content" });
    }

    user.name = name;
    user.profileSetupComplete = true;
    await user.save();
    res.status(200).json({ message: "Name set" });
  } catch (error) {
    console.error("Error in /setName: ", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/logout", async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(204).json({ message: "No content" });
    }

    const user = await User.findOne({ refreshToken });
    if (!user) {
      return res.status(204).json({ message: "No content" });
    }

    user.refreshToken = null;
    await user.save();

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error("Error in /logout: ", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/movies/actors", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const actorMovies = user.recommendations.actors || [];
    res.status(200).json(actorMovies);
  } catch (error) {
    console.error("Error fetching actor-based recommendations:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/movies/explore", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const actorMovies = user.recommendations.general || [];
    res.status(200).json(actorMovies);
  } catch (error) {
    console.error("Error fetching actor-based recommendations:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/movies/search", async (req, res) => {
  const { query } = req.query;

  if (!query || query.trim() === "") {
    return res.status(400).json({ message: "Query is required" });
  }

  try {
    const movies = await Movie.aggregate([
      {
        $match: {
          title: { $regex: query, $options: "i" },
        },
      },
      {
        $addFields: {
          startsWithQuery: {
            $cond: [
              {
                $regexMatch: {
                  input: "$title",
                  regex: new RegExp(`^${query}`, "i"),
                },
              },
              1,
              0,
            ],
          },
        },
      },
      {
        $sort: {
          startsWithQuery: -1,
          title: 1,
        },
      },
      { $limit: 10 },
    ]);

    res.status(200).json(movies);
  } catch (error) {
    console.error("Error fetching movies:", error.message, error.stack);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/movies/trending", async (req, res) => {
  try {
    const trendingMovies = await getOrUpdateTrendingMovies();
    res.status(200).json(trendingMovies);
  } catch (error) {
    console.error("Error fetching trending movies:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/watchlist/get", async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ message: "No refresh token" });
    }

    const user = await User.findOne({ refreshToken });
    if (!user) {
      return res.status(403).json({ message: "No user found" });
    }

    if (!user.watchlist) {
      user.watchlist = [];
    }
    const watchlistDetails = await Movie.find({
      tmdb_id: { $in: user.watchlist },
    });

    return res.status(200).json(watchlistDetails);
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.delete("/watchlist/delete", async (req, res) => {
  const { tmdb_id } = req.body;

  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ message: "No refresh token" });
    }

    const user = await User.findOne({ refreshToken });

    if (!user) {
      return res.status(403).json({ message: "User not found" });
    }
    if (!user.watchlist.includes(tmdb_id)) {
      return res.status(404).json({ message: "Movie not in watchlist" });
    }

    user.watchlist = user.watchlist.filter((id) => id !== tmdb_id);
    await user.save();
    res.status(200).json({ message: "Movie removed from watchlist" });
  } catch (error) {
    console.error("Error removing from watchlist:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/watchlist", async (req, res) => {
  const { tmdb_id } = req.body;
  if (!tmdb_id) {
    return res.status(400).json({ message: "Movie ID is required" });
  }
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ message: "No refresh token" });
    }

    const user = await User.findOne({ refreshToken });
    if (!user) {
      return res.status(403).json({ message: "No user found" });
    }

    if (!user.watchlist) {
      user.watchlist = [];
    }
    if (user.watchlist.includes(tmdb_id)) {
      return res.status(200).json({ message: "Already in watchlist" });
    }

    user.watchlist.push(tmdb_id);
    await user.save();
    return res.status(200).json({ message: "Movie added to watchlist" });
  } catch (error) {
    return res.status(500).json({ message: "Error adding to watchlist" });
  }
});
router.post("/saveRatings", authenticateToken, async (req, res) => {
  const { movieRatings } = req.body;

  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update or add movie ratings
    movieRatings.forEach(({ tmdb_id, rating }) => {
      const existingRating = user.movieRatings.find(
        (item) => item.tmdb_id === tmdb_id
      );

      if (existingRating) {
        existingRating.rating = rating;
      } else {
        user.movieRatings.push({ tmdb_id, rating: Number(rating) });
      }
    });

    // Set recommendations status to "loading"
    if (!user.recommendations) {
      user.recommendations = { status: "loading" };
    } else {
      user.recommendations.status = "loading"; // Ensure status is updated
    }

    await user.save();

    // Trigger the worker thread to update recommendations
    const worker = new Worker("./utils/recommendationWorker.js");
    worker.postMessage(user._id.toString());

    worker.on("message", (message) => {
      if (message.status === "success") {
        console.log(
          `Worker: Recommendations updated successfully for user ${user._id}`
        );
      } else {
        console.error(
          "Worker: Failed to update recommendations:",
          message.error
        );
      }
    });

    worker.on("error", (error) => {
      console.error("Worker encountered an error:", error);
    });

    worker.on("exit", (code) => {
      if (code !== 0) {
        console.error(`Worker stopped with exit code ${code}`);
      }
    });

    res
      .status(200)
      .json({ message: "Ratings saved. Recommendations are being updated." });
  } catch (error) {
    console.error("Error in saveRatings:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/user/ratings", async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ message: "No refresh token" });
    }

    const user = await User.findOne({ refreshToken });
    if (!user) {
      return res.status(403).json({ message: "No user found" });
    }

    return res.status(200).json(user.movieRatings || []);
  } catch (error) {
    console.error("Error fetching user ratings:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/movies/all", async (req, res) => {
  try {
    const movies = await Movie.find({});
    res.status(200).json(movies);
  } catch (error) {
    console.error("Error fetching all movies:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
router.get("/movies/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const numericId = Number(id);

    if (isNaN(numericId)) {
      return res.status(400).json({ message: "Invalid movie ID format" });
    }

    const movie = await Movie.findOne({ tmdb_id: numericId });

    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    res.status(200).json(movie);
  } catch (error) {
    console.error("Error fetching movie:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
router.get("/recommendations", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (!user.recommendations) {
      return res.status(200).json({
        status: "loading",
        general: [],
        actors: [],
        genres: {},
      });
    }

    const responseData = {
      status: user.recommendations.status || "ready",
      general: user.recommendations.general || [],
      actors: user.recommendations.actors || [],
      genres: user.recommendations.genres || {},
    };

    res.status(200).json(responseData);
  } catch (error) {
    console.error("Error in recommendations route:", error);
    res.status(500).json({ message: "Internal Server Error." });
  }
});

router.post("/saveRating", authenticateToken, async (req, res) => {
  const { tmdb_id, rating } = req.body;

  if (!tmdb_id || rating == null) {
    return res
      .status(400)
      .json({ message: `Invalid data provided. ${tmdb_id}  ${rating}` });
  }

  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const existingRating = user.movieRatings.find(
      (item) => item.tmdb_id === tmdb_id
    );

    if (existingRating) {
      existingRating.rating = rating;
    } else {
      user.movieRatings.push({ tmdb_id, rating: Number(rating) });
    }

    if (!user.recommendations) {
      user.recommendations = { status: "loading" };
    } else {
      user.recommendations.status = "loading";
    }

    await user.save();

    const worker = new Worker("./utils/recommendationWorker.js");
    worker.postMessage(user._id.toString());

    worker.on("message", (message) => {
      if (message.status === "success") {
        console.log(
          `Worker: Recommendations updated successfully for user ${user._id}`
        );
      } else {
        console.error(
          "Worker: Failed to update recommendations:",
          message.error
        );
      }
    });

    worker.on("error", (error) => {
      console.error("Worker encountered an error:", error);
    });

    worker.on("exit", (code) => {
      if (code !== 0) {
        console.error(`Worker stopped with exit code ${code}`);
      }
    });

    res
      .status(200)
      .json({ message: "Rating saved. Recommendations are being updated." });
  } catch (error) {
    console.error("Error in saveRating:", error);
    res.status(500).json({ message: "Internal Server Error." });
  }
});

router.get("/movies/genre/:genre", authenticateToken, async (req, res) => {
  const { genre } = req.params;

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const userGenres = Object.keys(user.recommendations.genres || {});
    if (!userGenres.includes(genre)) {
      return res.status(403).json({ message: "Access denied for this genre" });
    }

    const movies = user.recommendations.genres[genre] || [];
    res.status(200).json(movies);
  } catch (error) {
    console.error("Error fetching genre movies:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
