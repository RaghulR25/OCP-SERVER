import Counselor from "../modles/Counselor.js";

export const createCounselor = async (req, res) => {
  try {
    const { name, email, specialty, description, experience, expectedFees } = req.body;

    const counselor = await Counselor.create({
      user: req.user._id, 
      name,
      email,
      specialty,
      description,
      experience: Number(experience),
      expectedFees: Number(expectedFees),
    });

    res.status(201).json(counselor);
  } catch (err) {
    console.error("Error creating counselor:", err.message);
    res.status(500).json({ message: err.message });
  }
};

export const getAllCounselors = async (req, res) => {
  try {
    const counselors = await Counselor.find().populate("user", "name email role");
    res.json(counselors);
  } catch (err) {
    console.error("Error fetching counselors:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

export const getCounselor = async (req, res) => {
  try {
    const counselor = await Counselor.findById(req.params.id).populate("user", "name email role");
    if (!counselor) return res.status(404).json({ message: "Counselor not found" });
    res.json(counselor);
  } catch (err) {
    console.error("Error fetching counselor:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};
