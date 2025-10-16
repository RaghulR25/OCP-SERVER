import express from "express";
import { createCounselor, getAllCounselors, getCounselor } from "../controllers/counselorController.js";
import { protect, authorizeRoles } from "../middleware/auth.js";
import Counselor from "../modles/Counselor.js";

const router = express.Router();

router.post("/", protect, authorizeRoles("admin", "counselor"), createCounselor);


router.get("/", getAllCounselors);
router.get("/:id", getCounselor);

 router.get("/get/me", protect, async (req, res) => {
   try {
     const counselor = await Counselor.findOne({ user: req.user._id });
     if (!counselor) {
       return res.status(404).json({ message: "Counselor not found" });
     }
     res.status(200).json(counselor);
   } catch (error) {
     console.error("Error fetching counselor profile:", error);
     res.status(500).json({ message: "Failed to fetch counselor profile" });
   }
 });

export default router;
