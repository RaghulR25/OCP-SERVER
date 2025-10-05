import express from "express";
import Booking from "../modles/Booking.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// Create a booking
router.post("/", protect, async (req, res) => {
  try {
    const { user, counselor, date, time } = req.body;

    const booking = await Booking.create({ user, counselor, date, time });

    const populatedBooking = await booking.populate([
      { path: "user", select: "name email role" },
      { path: "counselor", select: "name email role specialty" },
    ]);

    res.status(201).json(populatedBooking);
  } catch (err) {
    res.status(500).json({ message: "Booking failed", error: err.message });
  }
});

// Get all bookings
router.get("/", protect, async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("user", "name email role")
      .populate("counselor", "name email role specialty");
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
});

router.get("/counselor/:id", protect, async (req, res) => {
  try {
    const bookings = await Booking.find({ counselor: req.params.id })
      .populate("user", "name email role")
      .populate("counselor", "name email role specialty");
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch counselor bookings" });
  }
});

router.get("/:id", protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("user", "name email role")
      .populate("counselor", "name email role specialty");
    res.json(booking);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch booking" });
  }
});
 router.get("/user/:id", protect, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.params.id })
      .populate("counselor", "name email specialty")
      .populate("user", "name email");
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch user bookings" });
  }
});

export default router;
