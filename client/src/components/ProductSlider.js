import { motion } from "framer-motion";
import ProductCard from "./ProductCard";
import "../styles/Slider.css";

const ProductSlider = ({ title, products }) => {
  return (
    <section className="slider-section">
      <h2>{title}</h2>

      <motion.div
        className="slider-container"
        drag="x"
        dragConstraints={{ left: -500, right: 0 }}
        whileTap={{ cursor: "grabbing" }}
      >
        {products.map((product) => (
          <motion.div key={product.id} className="slider-item">
            <ProductCard product={product} />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default ProductSlider;
