const CART_KEY = "cart";

/* Get full cart */
export const getCart = () => {
  return JSON.parse(localStorage.getItem(CART_KEY)) || [];
};

/* Add to cart */
export const addToCart = (product) => {
  const cart = getCart();

  const existing = cart.find(
    (item) => item.id === product.id || item._id === product._id
  );

  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }

  localStorage.setItem(CART_KEY, JSON.stringify(cart));
};

/* Get cart count (for navbar badge) */
export const getCartCount = () => {
  return getCart().reduce((total, item) => total + item.qty, 0);
};

/* ✅ Get cart items (used in Checkout) */
export const getCartItems = () => {
  return getCart();
};

/* ✅ Get cart total amount */
export const getCartTotal = () => {
  return getCart().reduce(
    (total, item) => total + item.price * item.qty,
    0
  );
};

/* ✅ Clear cart (after order placed) */
export const clearCart = () => {
  localStorage.removeItem(CART_KEY);
};
