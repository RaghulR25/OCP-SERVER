import express from "express";
import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
});


router.post("/create-checkout-session", async (req, res) => {
  const { amount, counselorId,  date, time } = req.body;

  if (!amount || !counselorId ) {
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
            unit_amount: amount * 100,
          },
          quantity: 1,
        },
      ],
success_url: `${process.env.FRONTEND_URL}dashboard`,
  cancel_url: `${process.env.FRONTEND_URL}dashboard`,
    });

    console.log("✅ Stripe session created:", session.id);
    res.json({ id: session.id, url: session.url });
  } catch (err) {
    console.error("❌ Stripe Session Error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

export default router;
