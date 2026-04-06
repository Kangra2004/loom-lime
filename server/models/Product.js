import mongoose from "mongoose";

/* ================= REVIEW SCHEMA ================= */

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },

    images: [String], // review images

    verifiedBuyer: {
      type: Boolean,
      default: false,
    },
   

    helpful: {
      type: Number,
      default: 0,
    },
    

    voters: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

/* ================= PRODUCT SCHEMA ================= */

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },

    image: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      enum: [ "shirts", "t-shirts", "hoodies", "jacket", "sweatshirts", "jeans", "cargos", "joggers", "shorts", "formal", "casual", "combo" ],
      required: true,
    },
    sizes: {
  size: String,     // S, M, L
      stock: Number 
},
 isCombo: {
    type: Boolean,
    default: false
  },


    description: String,
    stock: { type: Number, default: 10 },

    /* 🔥 REVIEWS */
    reviews: [reviewSchema],
    images: [String], // 🖼 review images
    verified: {
      type: Boolean,
      default: false,
    },

    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("Product", ProductSchema);