const mongoose = require("mongoose");

const eventSpaceSchema = new mongoose.Schema({
  name: String,
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  city: String,
  location: String,
  type: String,
  price: Number,
  capacity: Number,
  parkingAvailable: Boolean,
  acAvailable: Boolean,
  meals: {
    veg: Number,
    nonVeg: Number,
  },
  images: [String],
  timeSlots:  {
    type: [String],
    default: ["9 AM TO 3 PM", "3 PM TO 6 PM", "6 PM TO 11 PM", "11 PM TO 8 AM"],
  }, // Static list of available slots
  bookings: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      date: String, // Format: YYYY-MM-DD
      timeSlot: String,
      mealType: String,
      numPeople: Number,
    },
  ],
});

module.exports = mongoose.model("EventSpace", eventSpaceSchema);
