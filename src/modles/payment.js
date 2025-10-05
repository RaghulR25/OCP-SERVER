import mongoose from "mongoose";

const paymentSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  counselorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "counselor",
    required: true,
  },
  Session: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Session",
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "completed", "failed"],
    default: "pending",
  },
  paymentMethod: {
    type: String,
  },
}, { timestamps: true });

export default mongoose.model("Payment", paymentSchema);
