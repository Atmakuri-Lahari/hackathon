const jwt = require("jsonwebtoken");
const User = require("../models/User");

const verifyToken = (req, res, next) => {
  const authHeader = req.header("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Access Denied. No Token Provided." });
  }

  const token = authHeader.split(" ")[1]; // Extract token

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified; // Attach user info to request
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid or Expired Token." });
  }
};


exports.verifyUser = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) return res.status(401).json({ message: "Access denied. No token provided." });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).json({ message: "Invalid token." });
  }
};

const verifyOwner = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || user.role !== "owner") {
      return res.status(403).json({ error: "Access Denied. Only Owners Allowed." });
    }
    next();
  } catch (error) {
    res.status(500).json({ error: "Error verifying owner." });
  }
};

module.exports = { verifyToken, verifyOwner };
