import express from "express";
import Product from "../models/Product.js";
import { protect, isAdmin } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";
import Order from "../models/Order.js";
import { searchProducts } from "../controllers/productController.js";

const router = express.Router();

/* GET ALL PRODUCTS */
router.get("/", async (req, res) => {

  const { category } = req.query;

  let query = {};

  if (category) {
    query.category = category;
  }

  const products = await Product.find(query);

  res.json(products);

});



/* ADD PRODUCT */
router.post(
  "/",
  protect,
  isAdmin,
  upload.array("images", 4),
  async (req, res) => {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: "No image uploaded" });
      }

      const imagePaths = req.files.map(
        (file) => `/uploads/${file.filename}`
      );

      const product = new Product({
        name: req.body.name,
        price: req.body.price,
        category: req.body.category,
isCombo: req.body.isCombo === "true",
        description: req.body.description,
        image: imagePaths[0], // main image
        images: imagePaths,   // ✅ SAVE ALL IMAGES
        sizes: req.body.sizes
          ? JSON.parse(req.body.sizes)
          : [],
      });

      const savedProduct = await product.save();
      res.status(201).json(savedProduct);
    } catch (err) {
      console.log("UPLOAD ERROR:", err);
      res.status(500).json({ message: err.message });
    }
  }
);
/* DELETE PRODUCT */
router.delete("/:id", protect, isAdmin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    await product.deleteOne();
    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ADD REVIEW
router.post("/:id/reviews", protect, upload.array("images", 3), async (req, res) => {
  const { rating, comment } = req.body;

  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  const alreadyReviewed = product.reviews.find(
    (r) => r.user.toString() === req.user._id.toString()
  );

  if (alreadyReviewed) {
    return res.status(400).json({ message: "Product already reviewed" });
  }
const hasPurchased = await Order.findOne({
  user: req.user._id,
  "orderItems.product": req.params.id,
});

  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };

  product.reviews.push(review);

  product.numReviews = product.reviews.length;

  product.rating =
    product.reviews.reduce((acc, item) => acc + item.rating, 0) /
    product.reviews.length;

  await product.save();

  res.status(201).json({ message: "Review added" });
});

router.get("/category/:category", async (req, res) => {
  try {

    const products = await Product.find({
      category: req.params.category
    });

    res.json(products);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/:productId/reviews/:reviewId", protect, async (req, res) => {
  const product = await Product.findById(req.params.productId);

  const review = product.reviews.id(req.params.reviewId);

  if (review.user.toString() !== req.user._id.toString()) {
    return res.status(401).json({ message: "Not authorized" });
  }

  review.comment = req.body.comment;
  review.rating = req.body.rating;

  await product.save();
  res.json({ message: "Review updated" });
});
router.delete("/:productId/reviews/:reviewId", protect, async (req, res) => {
  const product = await Product.findById(req.params.productId);

  product.reviews = product.reviews.filter(
    (r) => r._id.toString() !== req.params.reviewId
  );

  await product.save();
  res.json({ message: "Review removed" });
});
router.post("/:productId/reviews/:reviewId/helpful", protect, async (req, res) => {
  const product = await Product.findById(req.params.productId);
  const review = product.reviews.id(req.params.reviewId);

  if (review.voters.includes(req.user._id)) {
    return res.status(400).json({ message: "Already voted" });
  }

  review.helpful += 1;
  review.voters.push(req.user._id);

  await product.save();

  res.json({ message: "Marked helpful" });
});
router.get("/:id", async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = 5;

  const product = await Product.findById(req.params.id);

  const totalReviews = product.reviews.length;

  const paginatedReviews = product.reviews
    .slice((page - 1) * limit, page * limit);

  res.json({
    ...product._doc,
    reviews: paginatedReviews,
    totalPages: Math.ceil(totalReviews / limit),
  });
});

router.post("/", async (req, res) => {
  const { name, price, category, sizes } = req.body;

  const product = new Product({
    name,
    price,
    category,
    sizes, // ✅ important
  });

  await product.save();
  res.json(product);
});

router.get("/search", searchProducts);

export const searchProductsRoute = router.get("/search", searchProducts);


export default router;