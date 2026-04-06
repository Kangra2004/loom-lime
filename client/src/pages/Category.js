import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import { getProductsByCategory } from "../services/productService";
const Category = () => {
  const { category } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    getProductsByCategory(category)
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [category]);

  return (
    
    <div style={{ padding: "100px 10%" }}>
      <h2 style={{ textTransform: "capitalize", marginBottom: "30px" }}>
        {category} Collection
      </h2>

      {loading ? (
        <p>Loading products...</p>
      ) : products.length > 0 ? (
        <div className="product-grid">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      ) : (
        <p>No products found.</p>
      )}
    </div>
  );
};

export default Category;
