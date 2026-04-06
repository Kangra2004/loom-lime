import { useSearch } from "../context/SearchContext";

const Products = ({ products }) => {
  const { searchQuery } = useSearch();

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="product-grid">
      {filteredProducts.length === 0 ? (
        <p>No products found 😕</p>
      ) : (
        filteredProducts.map((product) => (
          <div key={product._id} className="product-card">
            <h4>{product.name}</h4>
            <p>₹{product.price}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default Products;