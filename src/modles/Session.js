import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  counselorId: { type: mongoose.Schema.Types.ObjectId, ref: "Counselor" },
  type: String,
  date: Date,
}, { timestamps: true });

export default mongoose.model("Session", sessionSchema);
