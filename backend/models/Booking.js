const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  eventSpace: { type: mongoose.Schema.Types.ObjectId, ref: "EventSpace", required: true },
  date: { type: String, required: true }, // YYYY-MM-DD format
  timeSlot: { type: String, required: true },
  mealType: { type: String, required: true },
  numPeople: { type: Number, required: true },
  totalPrice: { type: Number, required: true }, // ✅ Store calculated price
});

module.exports = mongoose.model("Booking", BookingSchema);
