import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import User from "../models/User.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

/* ================= ADD TO WISHLIST ================= */
router.post("/wishlist/:productId", protect, async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user.wishlist.includes(req.params.productId)) {
    user.wishlist.push(req.params.productId);
    await user.save();
  }

  res.json(user.wishlist);
});

/* ================= GET WISHLIST ================= */
router.get("/wishlist", protect, async (req, res) => {
  const user = await User.findById(req.user._id).populate("wishlist");
  res.json(user.wishlist);
});

/* ================= REMOVE FROM WISHLIST ================= */
router.delete("/wishlist/:productId", protect, async (req, res) => {
  const user = await User.findById(req.user._id);

  user.wishlist = user.wishlist.filter(
    (id) => id.toString() !== req.params.productId
  );

  await user.save();
  res.json(user.wishlist);
});
/* GET PROFILE */
router.get("/profile", protect, async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  res.json(user);
});

/* UPDATE PROFILE */
router.put(
  "/profile",
  protect,
  upload.single("avatar"),
  async (req, res) => {
    const user = await User.findById(req.user._id);

    user.name = req.body.name || user.name;
    user.phone = req.body.phone || user.phone;
    user.city = req.body.city || user.city;
    user.addresses = req.body.addresses || user.addresses;

    // avatar upload
    if (req.file) {
      user.avatar = `/uploads/${req.file.filename}`;
    }

    const updatedUser = await user.save();

    res.json(updatedUser);
  }
);

export default router;