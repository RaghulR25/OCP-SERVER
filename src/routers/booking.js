// routes/bookingRoutes.js
import express from "express";
import Booking from "../modles/Booking.js";
import { protect } from "../middleware/auth.js";
import { getBookingsByUser } from "../controllers/bookingController.js";

const router = express.Router();

// ✅ Get all bookings for a specific user with counselor details
router.get("/user/:userId", getBookingsByUser);

// ✅ Get all bookings for a specific counselor (with user info)
router.get("/counselor/:counselorId", protect, async (req, res) => {
  try {
    const counselorId = req.params.counselorId.trim();

    const bookings = await Booking.find({ counselor: counselorId })
      .populate("user", "name email") // populate user info
      .sort({ date: 1, time: 1 });

    res.status(200).json(bookings);
  } catch (err) {
    console.error("Error fetching counselor bookings:", err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ Create a new booking
router.post("/", protect, async (req, res) => {
  try {
    const { user, counselor, date, time } = req.body;

    if (!user || !counselor || !date || !time) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const booking = await Booking.create({ user, counselor, date, time });

    const populatedBooking = await booking.populate(
      "counselor",
      "name email expectedFees specialty description"
    );

    res.status(201).json(populatedBooking);
  } catch (err) {
    console.error("Error creating booking:", err);
    res.status(500).json({ message: "Failed to create booking" });
  }
});


// ✅ Update booking payment status
router.put("/:bookingId/payment", async (req, res) => {
  try {
    const updatedBooking = await Booking.findByIdAndUpdate(
      req.params.bookingId,
      { paymentDone: true },
      { new: true }
    ).populate("counselor", "name email expectedFees specialty description"); // populate here too

    res.status(200).json(updatedBooking);
  } catch (err) {
    console.error("Error updating payment status:", err);
    res.status(500).json({ message: "Failed to update payment" });
  }
});

// ✅ Get all bookings (Admin use)
router.get("/", protect, async (req, res) => {
  try {
    const allBookings = await Booking.find()
      .populate("user", "name email")
      .populate("counselor", "name email expectedFees specialty description");

    res.status(200).json(allBookings);
  } catch (err) {
    console.error("Error fetching all bookings:", err);
    res.status(500).json({ message: "Failed to fetch all bookings" });
  }
});

export default router;
