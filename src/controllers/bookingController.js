import Booking from "../modles/Booking.js";

export const createBooking = async (req, res) => {
  try {
    const booking = await Booking.create({
      user: req.user.id, 
      counselor: req.body.counselor,
      date: req.body.date,
      time: req.body.time,
    });
    res.status(201).json(booking);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.params.userId }).populate("counselor");
    res.status(200).json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get bookings for a counselor
export const getCounselorBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ counselor: req.params.counselorId }).populate("user");
    res.status(200).json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};