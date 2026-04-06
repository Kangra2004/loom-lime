import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { motion } from "framer-motion";
import { API } from "../config";

const Cart = () => {

  const { cart, cartTotal, removeFromCart } = useCart();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div style={{ padding: "120px 10%" }}>

        <h2>Your Cart</h2>

        {cart.length === 0 ? (

          <p>Your cart is empty</p>

        ) : (

          <>
          {cart
  .filter(item => item.productId !== null) // ✅ FIX 1
  .map((item) => {

    const product = item.productId;

    return (

      <div
        key={product?._id}
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
          borderBottom: "1px solid #eee",
          paddingBottom: "10px"
        }}
      >

        {/* PRODUCT */}

        <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>

          {product?.image && (
            <img
              src={
  product.image?.startsWith("http")
    ? product.image
    : `${API}${product.image}`
}
              alt={product?.name}
              style={{
                width: "60px",
                height: "70px",
                objectFit: "cover",
                borderRadius: "6px"
              }}
            />
          )}

          <div>

            <strong>{product?.name || "Product removed"}</strong>

            <p>Qty: {item.quantity}</p>

            {product && (
              <button
                style={{
                  background: "#ff4d4d",
                  color: "white",
                  border: "none",
                  padding: "4px 10px",
                  borderRadius: "4px",
                  cursor: "pointer",
                  marginTop: "5px"
                }}
                onClick={() =>
  removeFromCart(product._id)
}
              >
                Remove ❌
              </button>
            )}

          </div>

        </div>

        {/* PRICE */}

        <div>
          ₹{product ? product.price * item.quantity : 0}
        </div>

      </div>

    );
  })}

            <h3>Total: ₹{cartTotal}</h3>

            <Link to="/checkout">

              <button
                style={{
                  marginTop: "20px",
                  padding: "12px 30px",
                  fontSize: "1rem",
                  backgroundColor: "#ffb703",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                Proceed to Checkout
              </button>

            </Link>

          </>

        )}

      </div>
    </motion.div>
  );
};

export default Cart;