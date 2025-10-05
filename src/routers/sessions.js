import express from "express";
import Session from "../modles/Session.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();


router.get("/", protect, async (req, res) => {
  const sessions = await Session.find({ userId: req.user._id }).populate("counselorId");
  res.json({ sessions });
});


router.post("/", protect, async (req, res) => {
  const { counselorId, type, date } = req.body;
  const session = await Session.create({ userId: req.user._id, counselorId, type, date });
  res.status(201).json(session);
});

export default router;
