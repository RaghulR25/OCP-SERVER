import Booking from "../modles/Booking.js";


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


export const getBookingsByUser = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.params.userId })
      .populate("counselor", "name email specialty expectedFees") 
       .populate("user", "name email")
      .sort({ date: 1, time: 1 });

    res.json(bookings);
  } catch (err) {
    console.error("Error fetching bookings:", err);
    res.status(500).json({ message: "Failed to fetch bookings" });
  }
};

export const getBookingsByCounselor = async (req, res) => {
  try {
    const bookings = await Booking.find({ counselor: req.params.counselorId })
      .populate("user", "name email"); 
    res.json(bookings);
  } catch (err) {
    console.error("Error fetching counselor bookings:", err);
    res.status(500).json({ message: "Failed to fetch counselor bookings" });
  }
};


export const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("user", "name email")
      .populate("counselor", "name email specialty expectedFees");

    if (!booking)
      return res.status(404).json({ message: "Booking not found" });

    res.status(200).json(booking);
  } catch (err) {
    console.error("Error fetching booking by ID:", err);
    res.status(500).json({ message: "Server error fetching booking" });
  }
};