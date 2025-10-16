import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";

// Import routes
import authRoutes from "./src/routers/auth.js";
import bookingRoutes from "./src/routers/booking.js";
import chatRoutes from "./src/routers/chat.js";
import counselorRoutes from "./src/routers/counselors.js";
import connectDB from "./src/config/db.js";
import sessionRoutes from "./src/routers/sessions.js";
import paymentRoutes from "./src/routers/payment.js";

dotenv.config();
const app = express();

console.log("🔑 Resend API Key:", process.env.RESEND_API_KEY);
// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/counselors", counselorRoutes);
// Mount routes
app.use("/api/sessions", sessionRoutes);
app.use("/api/payment", paymentRoutes);



// Setup HTTP + Socket.IO
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Socket.IO events
io.on("connection", (socket) => {
  console.log(" New client connected:", socket.id);

  socket.on("sendMessage", (data) => {
    console.log(" Message received:", data);
    io.emit("receiveMessage", data);
  });

  socket.on("disconnect", () => {
    console.log(" Client disconnected:", socket.id);
  });
});

// ✅ Connect DB & start server
connectDB().then(() => {
  server.listen(process.env.PORT || 3000, () => {
    console.log(` Server running on port ${process.env.PORT || 3000}`);
  });
});