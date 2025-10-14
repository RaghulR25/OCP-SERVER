import express from "express";
import { getChatByUser, postMessage } from "../controllers/chatController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// Get chat messages with a specific user/counselor
router.get("/:receiverId", protect, getChatByUser);

// Send a message
router.post("/", protect, postMessage);

export default router;
