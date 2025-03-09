const express = require("express");
const router = express.Router();
const EventSpace = require("../models/EventSpace");
const Booking = require("../models/Booking");
const User = require("../models/User"); // ✅ Ensure User is imported

// Book an Event Space
router.post("/:id/book", async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, date, timeSlot, mealType, numPeople } = req.body;
    collection.log(userId.value);
    console.log(date);
    console.log(timeSlot)
    console.log(mealType)
    console.log(numPeople)

    if (!userId || !date || !timeSlot || !mealType || !numPeople) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const eventSpace = await EventSpace.findById(id);
    if (!eventSpace) {
      return res.status(404).json({ error: "Event space not found" });
    }

    // Check if the time slot is available
    if (!eventSpace.timeSlots.includes(timeSlot)) {
      return res.status(400).json({ error: "Selected time slot is not available." });
    }

    // Calculate total price
    const mealPrice = mealType === "veg" ? eventSpace.meals.veg : eventSpace.meals.nonVeg;
    const totalPrice = eventSpace.price + numPeople * mealPrice;

    // Save booking
    const newBooking = new Booking({
      user: userId,
      eventSpace: id,
      date,
      timeSlot,
      mealType,
      numPeople,
      totalPrice, // ✅ Storing calculated total price
    });

    await newBooking.save();

    // Add booking to Event Space
    eventSpace.bookings.push({
      user: userId,
      date,
      timeSlot,
      mealType,
      numPeople,
    });

    // Remove the booked slot from available slots
    eventSpace.timeSlots = eventSpace.timeSlots.filter(slot => slot !== timeSlot);
    await eventSpace.save();

    // Add booking to User's history
    const user = await User.findById(userId);
    if (user) {
      user.bookings.push({
        eventSpace: id,
        date,
        timeSlot,
      });
      await user.save();
    }

    res.status(201).json({ message: "Booking successful", booking: newBooking });
  } catch (error) {
    console.error("Booking error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
