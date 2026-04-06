import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "react-hot-toast";
import { WishlistProvider } from "./context/WishlistContext";
const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <BrowserRouter>
    <AuthProvider>
  <CartProvider>
      <WishlistProvider>
        <App />
      </WishlistProvider>
      <Toaster position="top-right" />
  </CartProvider>
    </AuthProvider>
</BrowserRouter>
);