import { motion } from "framer-motion";
import "../styles/HeroSlider.css";

const slides = [
  { title: "Premium Men's Wear", subtitle: "Style that defines you" },
  { title: "Elegant Women's Collection", subtitle: "Grace in every outfit" },
  { title: "Kids Fashion", subtitle: "Comfort meets cuteness" },
];

const HeroSlider = () => {
  return (
    <div className="slider">
      {slides.map((slide, index) => (
        <motion.div
          className="slide"
          key={index}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
        >
          <h1>{slide.title}</h1>
          <p>{slide.subtitle}</p>
          <button>Shop Now</button>
        </motion.div>
      ))}
    </div>
  );
};

export default HeroSlider;
