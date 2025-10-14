import Booking from "../modles/Booking.js";

// Create Booking (only for logged-in user)
export const createBooking = async (req, res) => {
  try {
    const { counselor, date, time } = req.body;

    const existing = await Booking.findOne({
      user: req.user._id,
      counselor,
      date,
      time,
    });

    if (existing) {
      return res.status(400).json({ message: "Booking already exists" });
    }

    const booking = await Booking.create({
      user: req.user._id,
      counselor,
      date,
      time,
    });

    const populatedBooking = await booking.populate(
      "counselor",
      "name email expectedFees specialty description"
    );

    res.status(201).json(populatedBooking);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create booking" });
  }
};

// Get bookings for logged-in user
// Get bookings by user with counselor info populated
export const getBookingsByUser = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.params.userId })
      .populate("counselor", "name email specialty expectedFees") // make sure this is here
      .sort({ date: 1, time: 1 });

    res.json(bookings);
  } catch (err) {
    console.error("Error fetching bookings:", err);
    res.status(500).json({ message: "Failed to fetch bookings" });
  }
};

// ✅ Get all bookings for a specific counselor (with user details)
export const getBookingsByCounselor = async (req, res) => {
  try {
    const bookings = await Booking.find({ counselor: req.params.counselorId })
      .populate("user", "name email"); // include user details
    res.json(bookings);
  } catch (err) {
    console.error("Error fetching counselor bookings:", err);
    res.status(500).json({ message: "Failed to fetch counselor bookings" });
  }
};