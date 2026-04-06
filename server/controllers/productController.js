import Product from "../models/Product.js";

// @desc    Create new product
// @route   POST /api/products
// @access  Admin
export const createProduct = async (req, res) => {
  try {
    const {
      name,
      price,
      description,
      category,
      image,
      sizes
    } = req.body;

    // Convert sizes if coming as string (S,M,L,XL)
    let formattedSizes = sizes;

    if (typeof sizes === "string") {
      formattedSizes = sizes.split(",").map(size => size.trim());
    }

    const product = new Product({
      name,
      price,
      description,
      category,
      image,
      sizes: formattedSizes
    });

    const createdProduct = await product.save();

    res.status(201).json(createdProduct);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Product creation failed" });
  }
};


export const searchProducts = async (req, res) => {

  try {

    const keyword = req.query.q
      ? {
          $or: [
            { name: { $regex: req.query.q, $options: "i" } },
            { category: { $regex: req.query.q, $options: "i" } },
            { description: { $regex: req.query.q, $options: "i" } }
          ]
        }
      : {};

    const products = await Product.find(keyword);

    res.json(products);

  } catch (error) {

    res.status(500).json({ message: "Search failed" });

  }

};
