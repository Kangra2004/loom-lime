import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/PremiumCombos.css";
import { API } from "../config";

const PremiumCombos = () => {

  const [products, setProducts] = useState([]);
  const sliderRef = useRef(null);
  const autoScrollRef = useRef(null);
  const navigate = useNavigate(); // ⭐ navigation

  useEffect(() => {

    const fetchProducts = async () => {

      const res = await axios.get(
        `${API}/api/products`
      );

      const combos = res.data.filter(
        (p) =>
          p.isCombo === true ||
          p.name.toLowerCase().includes("combo") ||
          p.category === "combo"
      );

      setProducts(combos);

    };

    fetchProducts();

  }, []);

  /* ================= AUTO SCROLL ================= */

  useEffect(() => {

    const slider = sliderRef.current;

    if (!slider) return;

    autoScrollRef.current = setInterval(() => {

      slider.scrollBy({
        left: 1,
        behavior: "auto",
      });

      if (
        slider.scrollLeft + slider.clientWidth >=
        slider.scrollWidth
      ) {
        slider.scrollLeft = 0;
      }

    }, 15);

    return () => clearInterval(autoScrollRef.current);

  }, [products]);

  const pauseScroll = () => {
    clearInterval(autoScrollRef.current);
  };

  const resumeScroll = () => {

    const slider = sliderRef.current;

    autoScrollRef.current = setInterval(() => {

      slider.scrollBy({
        left: 1,
        behavior: "auto",
      });

      if (
        slider.scrollLeft + slider.clientWidth >=
        slider.scrollWidth
      ) {
        slider.scrollLeft = 0;
      }

    }, 15);

  };

  const scrollLeft = () => {
    sliderRef.current.scrollBy({
      left: -350,
      behavior: "smooth",
    });
  };

  const scrollRight = () => {
    sliderRef.current.scrollBy({
      left: 350,
      behavior: "smooth",
    });
  };

  if (products.length === 0) return null;

  return (

    <section className="combos-section">

      <h2 className="combos-title">
        Premium Combos For You
      </h2>

      <div className="combos-wrapper">

        <button
          className="combo-arrow left"
          onClick={scrollLeft}
        >
          ❮
        </button>

        <div
          className="combos-slider"
          ref={sliderRef}
          onMouseEnter={pauseScroll}
          onMouseLeave={resumeScroll}
        >

          {products.map((product) => (

            <div
              className="combo-card"
              key={product._id}
              onClick={() => navigate(`/product/${product._id}`)} // ⭐ CLICK REDIRECT
            >

              <img
              src={
  product.image?.startsWith("http")
    ? product.image
    : `${API}${product.image}`
}
                alt={product.name}
              />

              <h4>{product.name}</h4>

              <p>₹{product.price}</p>

            </div>

          ))}

        </div>

        <button
          className="combo-arrow right"
          onClick={scrollRight}
        >
          ❯
        </button>

      </div>

    </section>

  );

};

export default PremiumCombos;

