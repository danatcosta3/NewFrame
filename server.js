require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const bcrypt = require("bcrypt");
const User = require("./models/Users");
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(cors());
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.post("/api/register", async (req, res) => {
  try {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "user already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      email,
      password: hashedPassword,
    });
    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error:", error); // Add a detailed error log here
    res.status(500).json({ message: "Internal Server Error" });
  }
});

const PORT = 5001;
app.listen(PORT, () => console.log(`Sever running on port ${PORT}`));
