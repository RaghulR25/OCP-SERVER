import User from "../modles/User.js";
import jwt from "jsonwebtoken";
import { sendEmail } from "../utils/sendEmail.js";
import bcrypt from "bcryptjs";









export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
     

    const user = await User.create({
      name,
      email,
      password,
      role: role || "user",
    });

    await sendEmail(user.email, user.name);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" }),
    });
  } catch (err) {
    console.error("Register error:", err.message);
    res.status(500).json({ message: "Server error during registration" });
  }
};


export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials, email" });
     console.log(password, user.password)
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials , password" });

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" }),
    });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ message: "Server error during login" });
  }
};





export const getMe = async (req, res) => {
  try {
    // `req.user` should be set by your `protect` middleware
    const user = req.user;
    res.json({ user });
  } catch (err) {
    console.error("getMe error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};
