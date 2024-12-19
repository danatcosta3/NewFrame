const express = require("express");
const bcrypt = require("bcrypt"); // Missing bcrypt import
const jwt = require("jsonwebtoken"); // Missing jwt import
const User = require("../models/Users"); // Import your User model
const authenticateToken = require("../middleware/authMiddleware"); // Import your token auth middleware

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
    await newUser.save();
    res.status(201).json({ message: "User created successfully" });
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

// Protected Route: User Profile (only accessible with valid token)
router.get("/profile", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({ email: user.email, id: user._id });
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

router.post("/logout", authenticateToken, async (req, res) => {
  try {
    console.log("Logout route hit1"); // Add this for debugging

    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      console.log("Logout route hit2 NO TOKEN"); // Add this for debugging

      return res.status(204).json({ message: "No content" });
    }

    const user = await User.findOne({ refreshToken });
    if (!user) {
      console.log("Logout route hit3 NO USER"); // Add this for debugging

      return res.status(204).json({ message: "No content" });
    }
    console.log("Logout route hit4 USER"); // Add this for debugging

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

module.exports = router;
