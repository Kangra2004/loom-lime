import { useWishlist } from "../context/WishlistContext";
import ProductCard from "../components/ProductCard";

const Wishlist = () => {
  const { wishlist } = useWishlist();

  return (
    <div style={{ padding: "120px 10%" }}>
      <h2>Your Wishlist ❤️</h2>

      {wishlist.length === 0 ? (
        <p>No favorite products yet.</p>
      ) : (
        <div className="product-grid">
          {wishlist.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;