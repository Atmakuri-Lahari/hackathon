const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const fs = require("fs");

dotenv.config();
const app = express();

// Ensure 'uploads' directory exists
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Middleware
app.use(express.json()); // To handle JSON data
app.use(cors()); // Enable CORS

// Serve static files from the 'uploads' folder
app.use("/uploads", express.static(uploadDir));

// Import Routes
const authRoutes = require("./routes/authRoutes");
const eventSpaceRoutes = require("./routes/eventSpaces");
const bookingRoutes = require("./routes/bookingRoutes"); // ✅ Renamed correctly

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/eventSpaces", eventSpaceRoutes); // ✅ Changed to plural for consistency
app.use("/api/bookings", bookingRoutes); // ✅ Fixed import name

// Connect to MongoDB
mongoose.set("strictQuery", false); // ✅ Avoid deprecation warnings
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Failed:", err));

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
