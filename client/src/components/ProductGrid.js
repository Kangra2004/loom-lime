import ProductCard from "./ProductCard";
import ProductSkeleton from "./ProductSkeleton";
import { motion } from "framer-motion";

const ProductGrid = ({ products = [], loading = false }) => {

  const container = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0 }
  };

  return (

    <motion.div
      className="product-grid"
      variants={container}
      initial="hidden"
      animate="show"
    >

      {loading ? (

        Array.from({ length: 8 }).map((_, i) => (
          <ProductSkeleton key={i} />
        ))

      ) : products.length === 0 ? (

        <p>No products found</p>

      ) : (

        products.map((product) => (

          <motion.div
            key={product._id}
            variants={item}
          >

            <ProductCard product={product} />

          </motion.div>

        ))

      )}

    </motion.div>

  );

};

export default ProductGrid;