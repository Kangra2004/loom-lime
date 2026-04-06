import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import StarRating from "../components/StarRating";
import { FaStar } from "react-icons/fa";
import "../styles/ProductDetails.css";
import { toast } from "react-toastify";
import { API } from "../config";

const ProductDetails = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [sortType, setSortType] = useState("latest");

  /* FETCH PRODUCT */
  useEffect(() => {
    const fetchProduct = async () => {
      const res = await axios.get(
        `${API}/api/products/${id}`
      );
      setProduct(res.data);
    };
    fetchProduct();
  }, [id]);

  if (!product) return <div className="luxury-spinner"></div>;

  /* ADD TO CART */
  const handleAddToCart = async () => {
    if (!user) return alert("Please login first");
    if (!selectedSize) return alert("Please select size");

await addToCart(product._id);
toast.success("Added to cart");
  };

  /* SUBMIT REVIEW */
  const submitReview = async () => {
    if (!rating || !comment)
      return alert("Please give rating and comment");

    await axios.post(
      `${API}/api/products/${id}/reviews`,
      { rating, comment },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    setRating(0);
    setComment("");
    window.location.reload();
  };

  /* DELETE REVIEW */
  const deleteReview = async (reviewId) => {
    await axios.delete(
      `${API}/api/products/${id}/reviews/${reviewId}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    window.location.reload();
  };

  /* HELPFUL */
  const markHelpful = async (reviewId) => {
    await axios.post(
      `${API}/api/products/${id}/reviews/${reviewId}/helpful`,
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    window.location.reload();
  };

  /* SORT */
  const sortedReviews = [...product.reviews].sort((a, b) => {
    if (sortType === "highest") return b.rating - a.rating;
    if (sortType === "lowest") return a.rating - b.rating;
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  const average =
    product.reviews.length > 0
      ? (
          product.reviews.reduce((acc, item) => acc + item.rating, 0) /
          product.reviews.length
        ).toFixed(1)
      : 0;

  return (
    <div className="product-page">

      {/* LEFT */}
      <div className="product-left">
        <div className="thumbnail-column">
          {product.images?.map((img, index) => (
            <img
              key={index}
              src={`${API}${product.images[selectedImage]}`}
              alt="thumb"
              className={selectedImage === index ? "active-thumb" : ""}
              onClick={() => setSelectedImage(index)}
            />
          ))}
        </div>

       <div className="main-image">
  <img
   src={
  product.images[selectedImage]?.startsWith("http")
    ? product.images[selectedImage]
    : `${API}${product.images[selectedImage]}`
}
    alt={product.name}
  />
</div>
      </div>

      {/* RIGHT */}
      <div className="product-right">
        <h2 className="brand">{product.brand || "Loom & Line"}</h2>
        <h1>{product.name}</h1>

        <div className="rating-row">
          <StarRating rating={average} />
          <span>({product.reviews.length} Reviews)</span>
        </div>

        <div className="price-section">
  <h2>₹{product.price}</h2>

  {product.stock <= 3 && product.stock > 0 && (
    <p className="stock-danger">
      🔥 Hurry! Only {product.stock} left
    </p>
  )}

  {product.stock <= 5 && product.stock > 3 && (
    <p className="stock-warning">
      ⚠ Only {product.stock} left in stock
    </p>
  )}

  {product.stock === 0 && (
    <p className="out-of-stock">Out of Stock</p>
  )}
</div>

        <div className="size-section">
          <h4>Select Size</h4>
          <div>
            {product.sizes?.map((size) => (
              <span
                key={size}
                className={`size-box ${
                  selectedSize === size ? "active-size" : ""
                }`}
                onClick={() => setSelectedSize(size)}
              >
                {size}
              </span>
            ))}
          </div>
        </div>

       <button
  className="add-to-bag"
  disabled={!selectedSize || product.stock === 0}
  onClick={handleAddToCart}
>
  {product.stock === 0 ? "OUT OF STOCK" : "ADD TO BAG"}
</button>

        <div className="product-description">
          <h3>Product Details</h3>
          <p>{product.description}</p>
        </div>

        {/* ===== LUXURY REVIEW SECTION ===== */}
        <div className="luxury-review-section">

          <div className="luxury-rating-wrapper">
            <div className="luxury-rating-summary">
              <h2>{average} <span>★</span></h2>
              <p>{product.reviews.length} Reviews</p>
            </div>

            <div className="luxury-breakdown">
              {[5,4,3,2,1].map((star) => {
                const count = product.reviews.filter(r => r.rating === star).length;
                const percent =
                  product.reviews.length > 0
                    ? (count / product.reviews.length) * 100
                    : 0;

                return (
                  <div key={star} className="luxury-bar-row">
                    <span>{star}★</span>
                    <div className="luxury-bar">
                      <div
                        className="luxury-fill"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                    <span>{count}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* SORT */}
          <div className="luxury-sort">
            <select
              value={sortType}
              onChange={(e) => setSortType(e.target.value)}
            >
              <option value="latest">Latest</option>
              <option value="highest">Highest Rated</option>
              <option value="lowest">Lowest Rated</option>
            </select>
          </div>

          {/* REVIEWS */}
          {sortedReviews.map((review) => (
            <div key={review._id} className="luxury-review-card">

              <div className="luxury-review-header">
                <div className="luxury-avatar">
                  {review.name.charAt(0).toUpperCase()}
                </div>

                <div>
                  <strong>{review.name}</strong>
                  {review.verifiedBuyer && (
                    <span className="luxury-verified">
                      ✔ Verified Buyer
                    </span>
                  )}
                </div>
              </div>

              <StarRating rating={review.rating} />
              <p className="luxury-review-text">{review.comment}</p>

              <div className="luxury-review-actions">
                <button onClick={() => markHelpful(review._id)}>
                  Helpful ({review.helpful})
                </button>

                {user && user._id === review.user && (
                  <button
                    className="luxury-delete"
                    onClick={() => deleteReview(review._id)}
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}

          {/* WRITE REVIEW */}
          {user && (
            <div className="luxury-write-review">
              <h4>Write a Review</h4>

              <div className="luxury-star-input">
                {[1,2,3,4,5].map((star) => (
                  <FaStar
                    key={star}
                    onClick={() => setRating(star)}
                    className={star <= rating ? "active-star" : ""}
                  />
                ))}
              </div>

              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your experience..."
              />

              <button
                className="luxury-review-btn"
                onClick={submitReview}
              >
                Submit Review
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;