import express from "express";
import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

// ✅ Proper Stripe initialization with API version
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
});

// ✅ Create a Stripe Checkout Session
router.post("/create-checkout-session", async (req, res) => {
  const { amount, counselorId, userId, date, time } = req.body;

  if (!amount || !counselorId || !userId) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: "Counseling Session",
              description: `Session on ${date} at ${time}`,
            },
            unit_amount: amount * 100, // Stripe expects amount in paise
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.FRONTEND_URL}/payment-success?success=true&user=${userId}&counselor=${counselorId}&date=${date}&time=${time}`,
      cancel_url: `${process.env.FRONTEND_URL}/payment-cancel?cancel=true`,
    });

    console.log("✅ Stripe session created:", session.id);
    res.json({ id: session.id, url: session.url });
  } catch (err) {
    console.error("❌ Stripe Session Error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

export default router;
