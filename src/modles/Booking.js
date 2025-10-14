import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  counselor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Counselor",
    required: true,
  },
  date: String,
  time: String,
  paymentDone: {
    type: Boolean,
    default: false,
  },
});

export default mongoose.model("Booking", bookingSchema);
