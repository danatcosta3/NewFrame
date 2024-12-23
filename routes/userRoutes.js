const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/Users");
const authenticateToken = require("../middleware/authMiddleware");
const Movie = require("../models/Movies");
const router = express.Router();

// Register User
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

router.post("/movie", async (req, res) => {
  const { name } = req.body;

  try {
    const movie = await Movie.findOne({
      title: { $regex: name, $options: "i" },
    });

    if (movie) {
      return res.json(movie);
    } else {
      return res.status(404).json({ message: "Movie not found in database." });
    }
  } catch (error) {
    console.error("Error fetching movie:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/saveRatings", authenticateToken, async (req, res) => {
  const { movieRatings } = req.body;

  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    movieRatings.forEach(async (rating) => {
      const existingRating = user.movieRatings.find(
        (item) => item.tmdb_id === rating.tmdb_id
      );

      if (existingRating) {
        existingRating.rating = rating.rating;
      } else {
        user.movieRatings.push({
          tmdb_id: rating.tmdb_id,
          rating: Number(rating.rating),
        });
      }
    });
    await user.save();

    res.status(200).json({ message: "Ratings saved successfully" });
  } catch (error) {
    console.error("Error saving ratings:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
