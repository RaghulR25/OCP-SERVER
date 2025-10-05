import mongoose from "mongoose";

const counselorSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, 
  name: { type: String, required: true },
  email: { type: String, required: true },
  specialty: { type: String },
  description: { type: String },
  experience: { type: Number }, 
  expectedFees: { type: Number }, 
}, { timestamps: true });

export default mongoose.model("Counselor", counselorSchema);
