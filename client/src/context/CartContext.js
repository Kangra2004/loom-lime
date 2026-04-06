import { createContext, useContext, useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";
import { API } from "../config";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);

  // FETCH CART
  const fetchCart = useCallback(async () => {
    if (!user) {
      setCart([]);
      return;
    }

    try {
      setLoading(true);

      const res = await axios.get(
        `${API}/api/cart/${user._id}`
      );

      setCart(res.data.items || []);
    } catch (error) {
      console.error("Cart fetch error:", error);
      setCart([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // ADD
  const addToCart = useCallback(async (productId) => {
    if (!user) return;

    try {
      const { data } = await axios.post(
        `${API}/api/cart/add`,
        { userId: user._id, productId }
      );

      setCart(data.items || []);
    } catch (error) {
      console.error("Add to cart error:", error);
    }
  }, [user]);

  // REMOVE
  const removeFromCart = useCallback(async (productId) => {
    if (!user) return;

    try {
      const { data } = await axios.delete(
        `${API}/api/cart/${productId}/${user._id}`
      );

      setCart(data.items || []);
    } catch (error) {
      console.error(error);
    }
  }, [user]);

  // UPDATE
  const updateQuantity = useCallback(async (productId, quantity) => {
    if (!user) return;

    try {
      const { data } = await axios.put(
        `${API}/api/cart/update`,
        { userId: user._id, productId, quantity }
      );

      setCart(data.items || []);
    } catch (error) {
      console.error(error);
    }
  }, [user]);

  // CLEAR
  const clearCart = useCallback(async () => {
    if (!user) return;

    try {
      await axios.delete(
        `${API}/api/cart/clear/${user._id}`
      );

      setCart([]);
    } catch (error) {
      console.error("Clear cart error:", error);
    }
  }, [user]);

  // TOTAL
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const cartTotal = cart.reduce(
    (sum, item) => sum + (item.productId?.price || 0) * item.quantity,
    0
  );

  return (
    <CartContext.Provider value={{
      cart,
      loading,
      fetchCart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      cartCount,
      cartTotal,
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);