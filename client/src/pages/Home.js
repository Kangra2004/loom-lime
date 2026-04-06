import { useState, useEffect, useRef } from "react";import { motion, AnimatePresence } from "framer-motion";
import "../styles/Home.css";
import ProductGrid from "../components/ProductGrid";
import PremiumCombos from "../components/PremiumCombos";
import logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API } from "../config";

const Home = () => {

  const [showIntro, setShowIntro] = useState(true);
  const [products, setProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState("all");

  const navigate = useNavigate();
  const productsRef = useRef(null);
  const categories = [
  "all",
  "shirts",
  "t-shirts",
  "hoodies",
  "jacket",
  "sweatshirts",
  "jeans",
  "cargos",
  "joggers",
  "shorts"
];

  useEffect(() => {

    const timer = setTimeout(() => {
      setShowIntro(false);
    }, 2600);

    return () => clearTimeout(timer);

  }, []);

  useEffect(() => {

    const fetchProducts = async () => {

      const res = await axios.get(
  `${API}/api/products`
);

      setProducts(res.data);

    };

    fetchProducts();

  }, []);

  

const latestProducts = products.filter((p) => {
  if (p.isCombo) return false;

  if (activeCategory === "all") {
    return [
      "shirts",
      "t-shirts",
      "hoodies",
      "jacket",
      "sweatshirts",
      "jeans",
      "cargos",
      "joggers",
      "shorts"
    ].includes(p.category);
  }

  return p.category === activeCategory;
});

  return (

    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >

      <AnimatePresence>

        {showIntro && (

          <motion.div
            className="intro-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >

            <motion.img
              src={logo}
              alt="Logo"
              className="intro-logo"
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1 }}
            />

            <p>Crafted Style • Premium Comfort</p>

          </motion.div>

        )}

      </AnimatePresence>

      {!showIntro && (

        <>

          {/* HERO */}

          <section className="hero">

            <motion.img
              src="/images/hero.jpeg"
              alt="Hero"
              className="hero-bg"
              initial={{ scale: 1 }}
              animate={{ scale: 1.05 }}
              transition={{
                duration: 10,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            />

            <div className="hero-overlay"></div>

            <div className="hero-content">

              <button
  className="hero-btn"
  onClick={() =>
    productsRef.current?.scrollIntoView({
      behavior: "smooth",
    })
  }
>
  Explore Collection
</button>

            </div>

          </section>

          {/* FORMAL */}

          <section className="category-showcase">

            <motion.div
              className="category-row"
              initial={{ x: 200, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
            >

              <img
                src="/images/formal-banner.jpg"
                alt="Formal"
                onClick={() =>
                 navigate("/category/formal")
                }
              />

              <div className="category-text">

                <h2>Formal Wear</h2>
                <p>Elegant. Sharp. Professional.</p>

              </div>

            </motion.div>

          </section>

          {/* CASUAL */}

          <section className="category-showcase">

            <motion.div
              className="category-row reverse"
              initial={{ x: -200, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
            >

              <img
                src="/images/casual-banner.jpg"
                alt="Casual"
                onClick={() =>
                  navigate("/category/casual")
                }
              />

              <div className="category-text">

                <h2>Casual Wear</h2>
                <p>Relaxed. Comfortable. Stylish.</p>

              </div>

            </motion.div>

          </section>

          {/* COMBOS */}

          <PremiumCombos />

          {/* LATEST COLLECTION */}

        <section className="home-products" ref={productsRef}>

  <div className="container">

    <h2>Latest Collection</h2>

    <p className="section-subtitle">
      Fresh styles for every occasion
    </p>

    {/* CATEGORY TABS */}

    <div className="category-tabs">

  {categories.map((cat) => (

    <button
      key={cat}
      className={
        activeCategory === cat
          ? "tab-btn active"
          : "tab-btn"
      }
      onClick={() => setActiveCategory(cat)}
    >
      {cat.toUpperCase()}
    </button>

  ))}

  <span className="tab-underline"></span>

</div>
    <ProductGrid products={latestProducts} />

  </div>

</section>

        </>

      )}

    </motion.div>

  );

};

export default Home;