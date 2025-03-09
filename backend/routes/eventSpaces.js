const express = require("express");
const EventSpace = require("../models/EventSpace");
const { verifyToken, verifyOwner } = require("../middleware/authMiddleware");
const multer = require("multer");
const path = require("path");

const router = express.Router();

// Configure Multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Save files in 'uploads' folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  },
});

const upload = multer({ storage });

router.post("/add", verifyToken, verifyOwner, upload.array("images", 5), async (req, res) => {
    try {
      console.log("Request Body:", req.body);
      console.log("Uploaded Files:", req.files);
  
      const imagePaths = req.files.map((file) => `/uploads/${file.filename}`);
      const newSpace = new EventSpace({
        owner: req.user.id,
        name: req.body.name,
        price: req.body.price,
        address: req.body.address,
        city: req.body.city, // Ensure these fields are included
        location: req.body.location,
        type: req.body.type,
        capacity: req.body.capacity,
        meals: {
          veg: req.body.vegMeals,
          nonVeg: req.body.nonVegMeals,
        },
        parkingAvailable: req.body.parkingAvailable === "true",
        acAvailable: req.body.acAvailable === "true",
        images: imagePaths,
        timeSlots: req.body.timeSlots ? req.body.timeSlots.split(",") : [],
      });
  
      await newSpace.save();
      res.status(201).json({ message: "Event Space Added Successfully!", eventSpace: newSpace });
    } catch (error) {
      console.error("Error adding event space:", error);
      res.status(500).json({ error: "Error adding event space." });
    }
  });
  

// ✅ Get All Event Spaces (Filtered)
router.get("/", async (req, res) => {
  try {
    const { city, location, type } = req.query;
    let filters = {};

    if (city) filters.city = city;
    if (location) filters.location = location;
    if (type) filters.type = type;

    const spaces = await EventSpace.find(filters).populate("owner", "name email");
    res.json(spaces);
  } catch (error) {
    console.error("Error fetching event spaces:", error);
    res.status(500).json({ error: "Error fetching event spaces." });
  }
});

// ✅ Get Single Event Space by ID
router.get("/:id", async (req, res) => {
    try {
      const eventSpace = await EventSpace.findById(req.params.id).populate("owner", "name email");
      if (!eventSpace) {
        return res.status(404).json({ error: "Event space not found" });
      }
  
      const selectedDate = req.query.date;
  
      // Get booked time slots for this date
      const bookedSlots = eventSpace.bookings
        .filter((booking) => booking.date === selectedDate)
        .map((booking) => booking.timeSlot);
  
      // Filter available slots
      const availableSlots = eventSpace.timeSlots.filter((slot) => !bookedSlots.includes(slot));
  
      res.json({ ...eventSpace._doc, availableSlots });
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  });
  

  

// ✅ Update Event Space (Owner Only)
router.put("/:id", verifyToken, verifyOwner, upload.array("images", 20), async (req, res) => {
  try {
    const { name, price, address, city, location, type, capacity, meals, parkingAvailable, acAvailable, timeSlots } = req.body;

    let updatedFields = {
      name,
      price,
      address,
      city, // ✅ Added city field
      location, // ✅ Added location field
      type,
      capacity,
      meals: {
        veg: meals.veg,
        nonVeg: meals.nonVeg,
      },
      parkingAvailable: parkingAvailable === "true",
      acAvailable: acAvailable === "true",
      timeSlots: timeSlots ? timeSlots.split(",") : ["9 AM TO 3 PM", "3 PM TO 6 PM", "6 PM TO 11 PM", "11 PM TO 8 AM"],
    };

    if (req.files.length > 0) {
      updatedFields.images = req.files.map((file) => `/uploads/${file.filename}`);
    }

    const updatedSpace = await EventSpace.findByIdAndUpdate(req.params.id, updatedFields, { new: true });
    if (!updatedSpace) return res.status(404).json({ error: "Event Space Not Found." });

    res.json({ message: "Event Space Updated Successfully!", eventSpace: updatedSpace });
  } catch (error) {
    console.error("Error updating event space:", error);
    res.status(500).json({ error: "Error updating event space." });
  }
});

// ✅ Delete Event Space (Owner Only)
router.delete("/:id", verifyToken, verifyOwner, async (req, res) => {
  try {
    const space = await EventSpace.findById(req.params.id);
    if (!space) return res.status(404).json({ error: "Event Space Not Found." });

    await EventSpace.findByIdAndDelete(req.params.id);
    res.json({ message: "Event Space Deleted Successfully!" });
  } catch (error) {
    console.error("Error deleting event space:", error);
    res.status(500).json({ error: "Error deleting event space." });
  }
});

router.post("/:id/book", async (req, res) => {
    try {
      console.log("Received Booking Request:", req.body); 
  
      const {  userId,bookingDate, selectedSlot, selectedMeal, numPeople } = req.body;
      const eventSpaceId = req.params.id; 
  
      if (!bookingDate || !selectedSlot || !selectedMeal || !numPeople || !userId) {
        return res.status(400).json({ error: "All fields must be filled." });
      }
  
      const eventSpace = await EventSpace.findById(eventSpaceId);
      if (!eventSpace) {
        return res.status(404).json({ error: "Event space not found." });
      }
  
      // Booking logic remains unchanged...
  
    } catch (error) {
      console.error("Booking Error:", error);
      res.status(500).json({ error: "Server error. Please try again." });
    }
  });
  
  
  
  
  module.exports = router;