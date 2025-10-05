import express from "express";
import User from "../modles/User.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();


router.get("/", protect, authorize("admin"), async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json({ status: "success", results: users.length, users });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

export default router;
