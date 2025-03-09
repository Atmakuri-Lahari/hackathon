const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const router = express.Router();

// Register Route
const approvedOwners = ["owner1@gmail.com", "owner2@gmail.com", "owner3@gmail.com","owner4@gmail.com","owner5@gmail.com"];

// 📌 Register Route
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // ✅ Check if the user is registering as an event space owner
    if (role === "owner" && !approvedOwners.includes(email)) {
      return res.status(403).json({ message: "You are not authorized to register as an Event Space Owner." });
    }

    // Check if the email is already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email already registered." });

    // Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create New User
    const newUser = new User({ name, email, password: hashedPassword, role });
    await newUser.save();

    res.status(201).json({ message: "Registration successful" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});


// Login Route
const ADMIN_CREDENTIALS = {
  email: "admin@example.com",
  password: "admin123",
  role: "admin",
};

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
    const token = jwt.sign({ id: "admin_id", role: "admin" }, process.env.JWT_SECRET, { expiresIn: "1d" });
    return res.json({ token, role: "admin" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1d" });
    res.json({ token, role: user.role });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});


module.exports = router;
