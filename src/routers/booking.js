// routes/bookingRoutes.js
import express from "express";
import Booking from "../modles/Booking.js";

const router = express.Router();

// ✅ Get all bookings for a specific user (with counselor populated)
router.get("/user/:userId",  async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.params.userId })
      .populate("counselor", "name email expectedFees specialty description")
      .populate("user", "name email");

    res.json(bookings);
  } catch (err) {
    console.error("Error fetching bookings:", err);
    res.status(500).json({ message: "Failed to fetch bookings" });
  }
});

// ✅ Create a new booking
router.post("/", async (req, res) => {
  try {
    const { user, counselor, date, time } = req.body;
    const booking = await Booking.create({ user, counselor, date, time });
    const populatedBooking = await booking.populate("counselor", "name email expectedFees");
    res.status(201).json(populatedBooking);
  } catch (err) {
    console.error("Error creating booking:", err);
    res.status(500).json({ message: "Failed to create booking" });
  }
});


/**
 * 📌 Update booking payment status
 */
router.put("/:bookingId/payment", async (req, res) => {
  try {
    const updatedBooking = await Booking.findByIdAndUpdate(
      req.params.bookingId,
      { paymentDone: true },
      { new: true }
    );
    res.json(updatedBooking);
  } catch (err) {
    console.error("Error updating payment:", err);
    res.status(500).json({ message: "Failed to update payment" });
  }
});

/**
 * 📌 Get all bookings (Admin use)
 */
router.get("/", async (req, res) => {
  try {
    const allBookings = await Booking.find()
      .populate("user", "name email")
      .populate("counselor", "name email expectedFees");
    res.json(allBookings);
  } catch (err) {
    console.error("Error fetching all bookings:", err);
    res.status(500).json({ message: "Failed to fetch all bookings" });
  }
});

export default router;
