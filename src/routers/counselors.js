import express from "express";
import { createCounselor, getAllCounselors, getCounselor } from "../controllers/counselorController.js";
import { protect, authorizeRoles } from "../middleware/auth.js";

const router = express.Router();

router.post("/", protect, authorizeRoles("admin", "counselor"), createCounselor);


router.get("/", getAllCounselors);
router.get("/:id", getCounselor);

export default router;
