import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import ProductGrid from "../components/ProductGrid";
import "../styles/Shop.css";
import { API } from "../config";

const Shop = () => {

  const [products, setProducts] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();

  const params = new URLSearchParams(location.search);

  const category = params.get("category")?.toLowerCase();
  const sort = params.get("sort") || "";
  const maxPrice = params.get("maxPrice") || "";

  const bannerImages = {
    formal: "/images/formal-banner.jpg",
    casual: "/images/casual-banner.jpg",
  };

  useEffect(() => {
    const fetchProducts = async () => {

      const res = await axios.get(
        `http://${API}:5000/api/products`
      );

      setProducts(res.data);

    };

    fetchProducts();
  }, []);

  const updateQuery = (key, value) => {
    const newParams = new URLSearchParams(location.search);
    newParams.set(key, value);
    navigate(`?${newParams.toString()}`);
  };

  let filteredProducts = [...products];

  if (category) {
    filteredProducts = filteredProducts.filter(
      (p) => p.category === category
    );
  }

  if (maxPrice) {
    filteredProducts = filteredProducts.filter(
      (p) => p.price <= parseInt(maxPrice)
    );
  }

  if (sort === "low-high") {
    filteredProducts.sort((a, b) => a.price - b.price);
  }

  if (sort === "high-low") {
    filteredProducts.sort((a, b) => b.price - a.price);
  }

  return (
    <div className="shop-page">

      {category && bannerImages[category] && (
        <div className="category-banner">
          <img src={bannerImages[category]} alt={category} />
          <div className="banner-overlay">
            <h1>{category.toUpperCase()}</h1>
          </div>
        </div>
      )}

      <div className="shop-layout">

        {/* SIDEBAR */}
        <div className="sidebar">

          <h3>Filters</h3>

          <h4>Sort</h4>

          <select
            value={sort}
            onChange={(e) => updateQuery("sort", e.target.value)}
          >
            <option value="">Default</option>
            <option value="low-high">Price Low → High</option>
            <option value="high-low">Price High → Low</option>
          </select>

          <h4>Max Price</h4>

          <input
            type="range"
            min="500"
            max="5000"
            value={maxPrice}
            onChange={(e) =>
              updateQuery("maxPrice", e.target.value)
            }
          />

          <p>Up to ₹{maxPrice || 5000}</p>

        </div>

        {/* PRODUCTS */}
        <div className="shop-content">

          <h4>{filteredProducts.length} Products Found</h4>

          <ProductGrid products={filteredProducts} />

        </div>

      </div>
    </div>
  );
};

export default Shop;