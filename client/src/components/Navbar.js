import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaHeart, FaShoppingCart, FaSearch } from "react-icons/fa";
import axios from "axios";

import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useAuth } from "../context/AuthContext";

import logo from "../assets/logo.png";
import "../styles/SphereNavbar.css";
import { API } from "../config";

const Navbar = () => {

  const { cartCount, fetchCart } = useCart();
  const { wishlist } = useWishlist();
  const { user } = useAuth();

  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false); // ✅ NEW

  /* ================= FETCH PRODUCTS ================= */

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${API}/api/products`);
        setAllProducts(res.data);
      } catch (error) {
        console.error("Product fetch error:", error);
      }
    };

    fetchProducts();
  }, []);

  /* ================= FETCH CART ================= */

  useEffect(() => {
    if (user) {
      fetchCart();
    }
  }, [user, fetchCart]);

  /* ================= SEARCH ================= */

  const handleSearch = (e) => {
    e.preventDefault();

    if (search.trim()) {
      navigate(`/search/${search}`);
      setSuggestions([]);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearch(value);

    if (value.trim() === "") {
      setSuggestions([]);
      return;
    }

    const keywords = value
      .toLowerCase()
      .split(" ")
      .filter((word) => word.length > 0);

    const filtered = allProducts.filter((p) => {
      const name = p.name?.toLowerCase() || "";
      const category = p.category?.toLowerCase() || "";
      const description = p.description?.toLowerCase() || "";

      return keywords.some((word) =>
        name.includes(word) ||
        category.includes(word) ||
        description.includes(word)
      );
    });

    setSuggestions(filtered.slice(0, 5));
  };

  return (

    <div className="sphere-navbar-wrapper">

      {/* LEFT */}
      <div className="nav-left">
        <Link to="/">
          <img src={logo} alt="Logo" />
        </Link>
      </div>

      {/* ✅ HAMBURGER */}
      <div
        className="hamburger"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? "✖" : "☰"}
      </div>

      {/* CENTER MENU */}
      <div className={`nav-center ${menuOpen ? "active" : ""}`}>

        <div className="nav-sphere">

          <Link to="/" onClick={()=>setMenuOpen(false)}>Home</Link>

          <div className="nav-item dropdown">

            <span className="nav-link">Category</span>

            <div className="dropdown-menu">

              <div className="mega-column">
                <h4>Category</h4>
                <Link to="/category/formal">Formal</Link>
                <Link to="/combo">Combo</Link>
                <Link to="/category/casual">Casual</Link>
              </div>

              <div className="mega-column">
                <h4>Top Wear</h4>
                <Link to="/category/shirts">Shirts</Link>
                <Link to="/category/t-shirts">T-Shirts</Link>
                <Link to="/category/hoodies">Hoodies</Link>
                <Link to="/category/jacket">Jackets</Link>
                <Link to="/category/sweatshirts">Sweatshirts</Link>
              </div>

              <div className="mega-column">
                <h4>Bottom Wear</h4>
                <Link to="/category/jeans">Jeans</Link>
                <Link to="/category/cargos">Cargos</Link>
                <Link to="/category/joggers">Joggers</Link>
                <Link to="/category/shorts">Shorts</Link>
              </div>

            </div>

          </div>

          <Link to="/about" onClick={()=>setMenuOpen(false)}>About</Link>
          <Link to="/contact" onClick={()=>setMenuOpen(false)}>Contact</Link>

        </div>

      </div>

      {/* SEARCH */}
      <form className="nav-search" onSubmit={handleSearch}>

        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={handleInputChange}
        />

        {suggestions.length > 0 && (
          <div className="search-suggestions">
            {suggestions.map((product) => (
              <div
                key={product._id}
                className="suggestion-item"
                onClick={() => {
                  navigate(`/product/${product._id}`);
                  setSuggestions([]);
                }}
              >
                <img
                  src={
                    product.image?.startsWith("http")
                      ? product.image
                      : `${API}${product.image}`
                  }
                  alt={product.name}
                />
                <span>{product.name}</span>
              </div>
            ))}
          </div>
        )}

        <FaSearch className="search-icon" />

      </form>

      {/* RIGHT */}
      <div className="nav-right">

        <Link to="/wishlist" className="icon-wrapper nav-icon">
          <FaHeart />
          {wishlist?.length > 0 && (
            <span className="icon-badge">{wishlist.length}</span>
          )}
        </Link>

        <Link to={user ? "/profile" : "/login"} className="nav-icon">
          <FaUser />
        </Link>

        <Link to="/cart" className="icon-wrapper nav-icon">
          <FaShoppingCart />
          {cartCount > 0 && (
            <span className="icon-badge">{cartCount}</span>
          )}
        </Link>

      </div>

    </div>
  );
};

export default Navbar;