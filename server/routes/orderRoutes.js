import express from "express";
import Order from "../models/Order.js";
import { protect, isAdmin } from "../middleware/authMiddleware.js";
import sendEmail from "../utils/sendEmail.js";
import PDFDocument from "pdfkit";

const router = express.Router();

/* ================= CREATE ORDER ================= */

router.post("/", protect, async (req, res) => {
  try {

    const order = new Order({
      user: req.user._id,
      orderItems: req.body.orderItems,
      shippingAddress: req.body.shippingAddress,
      totalPrice: req.body.totalPrice,
      isPaid: req.body.isPaid || false
    });

    const createdOrder = await order.save();

    /* ✅ SEND EMAIL */

    await sendEmail(
      req.user.email,
      "Order Confirmation",
      `Your order of ₹${createdOrder.totalPrice} has been placed successfully!\n\nOrder ID: ${createdOrder._id}`
    );

    res.status(201).json(createdOrder);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Order creation failed" });
  }
});

/* ================= USER ORDERS ================= */

router.get("/myorders", protect, async (req, res) => {

  const orders = await Order.find({ user: req.user._id })
    .sort({ createdAt: -1 });

  res.json(orders);

});

/* ================= ADMIN ALL ORDERS ================= */

router.get("/", protect, isAdmin, async (req, res) => {

  const orders = await Order.find()
    .populate("user", "name email")
    .sort({ createdAt: -1 });

  res.json(orders);

});

/* ================= CANCEL ORDER ================= */

router.put("/:id/cancel", protect, async (req, res) => {

  const order = await Order.findById(req.params.id);

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  order.status = "Cancelled";
  order.cancelReason = req.body.reason;

  await order.save();

  res.json({ message: "Order cancelled successfully" });

});

/* ================= RETURN ORDER ================= */

router.put("/:id/return", protect, async (req, res) => {

  const order = await Order.findById(req.params.id);

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  order.returnStatus = "Requested";
  order.returnReason = req.body.reason;
  order.refundAmount = order.totalPrice;

  await order.save();

  res.json({ message: "Return request submitted" });

});

/* ================= ADMIN UPDATE STATUS ================= */

router.put("/:id/status", protect, isAdmin, async (req, res) => {

  try {

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = req.body.status;

    if (req.body.status === "Delivered") {
      order.isDelivered = true;
    }

    await order.save();

    res.json(order);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }

});

/* DOWNLOAD INVOICE */ router.get("/:id/invoice", protect, async (req,res)=>{ const order = await Order.findById(req.params.id); if(!order){ return res.status(404).send("Order not found"); } const doc = new PDFDocument(); res.setHeader("Content-Type","application/pdf"); res.setHeader( "Content-Disposition", `attachment; filename=invoice-${order._id}.pdf` ); doc.pipe(res); doc.fontSize(20).text("INVOICE",{align:"center"}); doc.moveDown(); doc.text(`Order ID: ${order._id}`); doc.text(`Total: ₹${order.totalPrice}`); doc.text(`Status: ${order.status}`); doc.moveDown(); order.orderItems.forEach(item=>{ doc.text(`${item.name} x ${item.quantity} = ₹${item.price * item.quantity}`); }); doc.end(); });


/* ADMIN ANALYTICS */

router.get("/analytics", protect, isAdmin, async (req,res)=>{

const orders = await Order.find();

const totalOrders = orders.length;

const totalRevenue = orders.reduce(
(sum,o)=> sum + o.totalPrice, 0
);

const delivered = orders.filter(o=>o.status==="Delivered").length;

res.json({
totalOrders,
totalRevenue,
delivered
});

});


export default router;
