import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Footer from "./components/Footer";
import Cart from "./pages/Cart";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Navbar from "./components/Navbar";
import Checkout from "./pages/Checkout";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProductDetails from "./pages/ProductDetails";
import { AnimatePresence } from "framer-motion";
import AdminDashboard from "./pages/AdminDashboard";
import { useAuth } from "./context/AuthContext";
import AdminOrders from "./pages/AdminOrders";
import MyOrders from "./pages/Myorders";
import LuxuryCursor from "./components/LuxuryCursor";
import Wishlist from "./pages/Wishlist";
import Profile from "./pages/Profile";
import CategoryPage from "./pages/CategoryPage";
import SearchResults from "./pages/SearchResults";
import Shop from "./pages/Shop";
import ComboPage from "./pages/ComboPage";
function App() {

  const location = useLocation();
  const { user } = useAuth();

  return (

    <div className="app-layout">

      <ToastContainer position="top-right" autoClose={2000} theme="dark" />

      <Navbar />
      <LuxuryCursor />

      <AnimatePresence mode="wait">

        <div className="main-content">

          <Routes location={location} key={location.pathname}>

            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />

            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />

            <Route path="/product/:id" element={<ProductDetails />} />

            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/my-orders" element={<MyOrders />} />

            <Route path="/search/:query" element={<SearchResults />} />

            <Route path="/shop" element={<Shop />} />
            <Route path="/combo" element={<ComboPage />} />

            {/* IMPORTANT CATEGORY ROUTE */}
            <Route path="/category/:type" element={<CategoryPage />} />

            <Route
              path="/profile"
              element={user ? <Profile /> : <Navigate to="/login" />}
            />

            <Route
              path="/admin/orders"
              element={
                user?.role === "admin"
                  ? <AdminOrders />
                  : <Navigate to="/" />
              }
            />

            <Route
              path="/admin"
              element={
                user?.role === "admin"
                  ? <AdminDashboard />
                  : <Navigate to="/" replace />
              }
            />

          </Routes>

        </div>

      </AnimatePresence>

      <Footer />

    </div>

  );

}

export default App;
