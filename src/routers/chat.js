
import express from "express";
import { getChatByBooking, postMessage } from "../controllers/chatController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/booking/:bookingId", protect, getChatByBooking);
router.post("/", protect, postMessage);

export default router;
