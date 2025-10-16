
import express from "express";
import Booking from "../modles/Booking.js";
import { protect } from "../middleware/auth.js";
import { getBookingsByUser } from "../controllers/bookingController.js";
import Counselor from "../modles/Counselor.js";
import { getBookingById } from "../controllers/bookingController.js";

const router = express.Router();


router.get("/user/:userId", getBookingsByUser);


router.get("/counselor/:counselorId", protect, async (req, res) => {
  try {
    const counselorId = req.params.counselorId.trim();
    console.log("Fetching bookings for counselorId:", counselorId);
    
    const bookings = await Booking.find({ counselor: counselorId })
      .populate("user", "name email") 
      .sort({ date: 1, time: 1 });

    res.status(200).json(bookings);
  } catch (err) {
    console.error("Error fetching counselor bookings:", err);
    res.status(500).json({ error: err.message });
  }
});


router.post("/", protect, async (req, res) => {
  try {
    const { counselor, date, time } = req.body;
    console.log("Creating booking with data:", req.body);

    if ( !counselor || !date || !time) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const counselorID = await Counselor.findById(counselor);
    const booking = new Booking({ user: req.user._id, counselor: counselorID._id, date, time });
    await booking.save(); 
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


router.put("/:bookingId/payment", async (req, res) => {
  try {
    const updatedBooking = await Booking.findByIdAndUpdate(
      req.params.bookingId,
      { paymentDone: true },
      { new: true }
    ).populate("counselor", "name email expectedFees specialty description");

    res.status(200).json(updatedBooking);
  } catch (err) {
    console.error("Error updating payment status:", err);
    res.status(500).json({ message: "Failed to update payment" });
  }
});


router.get("/", protect, async (req, res) => {
  try {
    const allBookings = await Booking.find()
      .populate("user", "name email")
      .populate("counselor", "name email expectedFees specialty description");
    console.log("All bookings fetched:", allBookings);
    res.status(200).json(allBookings);
  } catch (err) {
    console.error("Error fetching all bookings:", err);
    res.status(500).json({ message: "Failed to fetch all bookings" });
  }
});

  router.get("/:id", protect, getBookingById);


export default router;
