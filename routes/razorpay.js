const express = require("express");
const Razorpay = require("razorpay");
const router = express.Router();
const crypto = require("crypto");

// Load environment variables
require("dotenv").config();

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create Order Endpoint
router.post("/payment", async (req, res) => {
  const { amount, currency, receipt, payment_capture } = req.body;

  try {
    const options = {
      amount: amount * 100, // amount in the smallest currency unit
      currency,
      receipt,
      payment_capture,
    };
    const order = await razorpay.orders.create(options);
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Verify Payment Endpoint
router.post("/verify-payment", (req, res) => {
  const { order_id, payment_id, signature } = req.body;
  const shasum = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);
  shasum.update(`${order_id}|${payment_id}`);
  const digest = shasum.digest("hex");

  if (digest === signature) {
    res.status(200).json({ status: "success" });
  } else {
    res.status(400).json({ status: "failure" });
  }
});

module.exports = router;
