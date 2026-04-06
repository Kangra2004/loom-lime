import express from "express";
import Newsletter from "../models/Newsletter.js";
import nodemailer from "nodemailer";

const router = express.Router();

/* ================= EMAIL TRANSPORTER ================= */
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/* ================= SUBSCRIBE ROUTE ================= */
router.post("/subscribe", async (req, res) => {

  try {

    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email required" });
    }

    // SAVE TO DATABASE
    const subscriber = await Newsletter.create({ email });

    // EMAIL TRANSPORTER
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

     // SEND EMAIL
    await transporter.sendMail({
      from: `"Loom & Line" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Welcome to Loom & Line",
      html: `
        <h2>Thank you for subscribing!</h2>
        <p>You will now receive updates about new arrivals.</p>
      `
    });

    res.json({ message: "Subscribed successfully" });

  } catch (error) {

    console.log("Newsletter error:", error);

    res.status(500).json({ message: "Email sending failed" });

  }

});

export default router;
