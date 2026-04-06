import express from "express";
import Razorpay from "razorpay";
import crypto from "crypto";

const router = express.Router();

/* CREATE ORDER */
router.post("/create-order", async (req, res) => {
  try {

    console.log("Incoming amount:", req.body.amount); // 🔥 DEBUG

    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      return res.status(500).json({ message: "Razorpay keys missing" });
    }

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    // ❗ FIX: ensure number + correct format
    const amount = Number(req.body.amount);

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    const options = {
      amount: amount * 100, // ✅ multiply ONLY here
      currency: "INR",
    };

    const order = await razorpay.orders.create(options);

    res.json(order);

  } catch (error) {
    console.log("RAZORPAY FULL ERROR:", error); // 🔥 IMPORTANT
    res.status(500).json({ message: error.message });
  }
});

/* VERIFY PAYMENT */
router.post("/verify", async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      res.json({ success: true });
    } else {
      res.status(400).json({ success: false });
    }
  } catch (error) {
    res.status(500).json({ message: "Verification failed" });
  }
});

export default router;