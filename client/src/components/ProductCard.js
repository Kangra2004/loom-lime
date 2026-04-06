import { motion } from "framer-motion";
import { useCart } from "../context/CartContext";
import "../styles/Product.css";
import { useNavigate , useLocation } from "react-router-dom";
import { useState } from "react";
import { FaHeart  } from "react-icons/fa";
import { useWishlist } from "../context/WishlistContext";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import { API } from "../config";


const ProductCard = ({ product }) => {
   const { wishlist, toggleWishlist } = useWishlist();

  const isFav = wishlist.some(
    (item) => item._id === product._id
  );
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [showQuickView, setShowQuickView] = useState(false);
  const { user } = useAuth();
  const location = useLocation();
  

  const handleAddToCart = async () => {
  if (!user) {
    navigate("/login", { state: { from: location.pathname } });
    return;
  }

  await addToCart(user._id, product._id);
  toast.success("Added to cart");
};
const handleWishlist = (e) => {
  e.stopPropagation();

  if (!user) {
    alert("Please login to use wishlist");
navigate("/login", { state: { from: location.pathname } });
    return;
  }

  toggleWishlist(product);
};
  return (
    
    <motion.div
      className="product-card"
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 200 }}
      onMouseEnter={() => setShowQuickView(true)}
      onMouseLeave={() => setShowQuickView(false)}
      onClick={() => navigate(`/product/${product._id}`)}
    >
     
      {/* IMAGE */}
      <img
 src={
  product.image?.startsWith("http")
    ? product.image
    : `${API}${product.image}`
}
  alt={product.name}
  loading="lazy"
/>



      {/* QUICK VIEW OVERLAY */}
      {showQuickView && (
        <div
          className="quick-view"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/product/${product._id}`);
          }}
        >
          Quick View
        </div>
      )}
  {/* Wishlist Icon */}
     <div
  className="wishlist-icon"
  onClick={handleWishlist}
>
  <FaHeart
    className={isFav ? "heart active" : "heart"}
  />
</div>
      <div className="product-info">
        <h4>{product.name}</h4>
        <p>₹{product.price}</p>

        <motion.button
          onClick={handleAddToCart}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Add to Cart
        </motion.button>
      </div>
    </motion.div>
  );
};

export default ProductCard;