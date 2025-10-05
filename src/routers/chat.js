import express from "express";
import { getChatByUser, postMessage } from "../controllers/chatController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();


router.get("/:receiverId", protect, getChatByUser);

router.post("/", protect, postMessage);

export default router;
