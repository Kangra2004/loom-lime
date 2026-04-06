import express from "express";
import Cart from "../models/Cart.js";

const router = express.Router();

/* ================= ADD ================= */

router.post("/add", async (req, res) => {
  try {

    const { userId, productId } = req.body;

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }

    const existingItem = cart.items.find(
      (item) => item.productId.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.items.push({ productId, quantity: 1 });
    }

    await cart.save();

    const populatedCart = await Cart.findOne({ user: userId })
      .populate("items.productId");

    res.json(populatedCart);

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});


/* ================= UPDATE ================= */

router.put("/update", async (req, res) => {

  try {

    const { userId, productId, quantity } = req.body;

    const cart = await Cart.findOne({ user: userId });

    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items
      .map(item =>
        item.productId.toString() === productId
          ? { ...item.toObject(), quantity }
          : item
      )
      .filter(item => item.quantity > 0);

    await cart.save();

    const populatedCart = await Cart.findOne({ user: userId })
      .populate("items.productId");

    res.json(populatedCart);

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }

});


/* ================= REMOVE ITEM ================= */

router.delete("/:productId/:userId", async (req, res) => {

  try {

    const { productId, userId } = req.params;

    const cart = await Cart.findOne({ user: userId });

    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter(
      item => item.productId.toString() !== productId
    );

    await cart.save();

    const populatedCart = await Cart.findOne({ user: userId })
      .populate("items.productId");

    res.json(populatedCart);

  } catch (error) {

    console.log(error);
    res.status(500).json({ message: "Server error" });

  }

});


/* ================= GET CART ================= */

/* ================= GET CART ================= */

router.get("/:userId", async (req, res) => {
  try {

    let cart = await Cart.findOne({
      user: req.params.userId
    }).populate("items.productId");

    if (!cart) {
      return res.json({ items: [] });
    }

    // ✅ REMOVE NULL PRODUCTS (VERY IMPORTANT)
   cart.items = cart.items.filter(item => item.productId !== null);

    await cart.save();

    res.json(cart);

  } catch (error) {
    console.log("Cart fetch error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;