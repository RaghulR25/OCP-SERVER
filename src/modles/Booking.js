// models/Booking.js
import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId,
     ref: "User", required: true 
    },
  counselor: {
     type: mongoose.Schema.Types.ObjectId, 
     ref: "User", required: true 
    },
  date: { 
    type: String, required: true },
  time: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  paymentDone: { type: Boolean, default: false } 
});

export default mongoose.model("Booking", bookingSchema);
