import { useParams } from "react-router-dom";
import products from "../data/products"; // adjust path
import ProductCard from "../components/ProductCard";
import "../styles/CategoryPage.css";

const SearchResults = () => {
  const { query } = useParams();

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="category-page">
      <h2 className="category-title">
        Search Results for "{query}"
      </h2>

      <div className="category-grid">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <p>No matching products found.</p>
        )}
      </div>
    </div>
  );
};

export default SearchResults;