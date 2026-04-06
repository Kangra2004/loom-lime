import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";
import { API } from "../config";

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState([]);

  const token = user?.token;

  // FETCH WISHLIST WHEN USER CHANGES
  useEffect(() => {
    const fetchWishlist = async () => {
      if (!token) {
        setWishlist([]);
        return;
      }

      try {
        const { data } = await axios.get(
          `${API}/api/users/wishlist`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setWishlist(data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchWishlist();
  }, [token]);

  // TOGGLE WISHLIST
  const toggleWishlist = async (product) => {
    if (!token) {
      alert("Please login first");
      return;
    }

    const exists = wishlist.find(
      (item) => item._id === product._id
    );

    try {
      if (exists) {
        await axios.delete(
          `${API}/api/users/wishlist/${product._id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setWishlist(
          wishlist.filter(
            (item) => item._id !== product._id
          )
        );
      } else {
        await axios.post(
          `${API}/api/users/wishlist/${product._id}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setWishlist([...wishlist, product]);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);