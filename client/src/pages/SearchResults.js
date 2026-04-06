import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import ProductGrid from "../components/ProductGrid";
import { API } from "../config";

const SearchResults = () => {

  const { query } = useParams();
  const [products, setProducts] = useState([]);

  useEffect(() => {

    const fetchProducts = async () => {

      try {

        const res = await axios.get(
          `http://${API}:5000/api/products`
        );
const keywords = query
  .toLowerCase()
  .split(" ")
  .filter((word) => word.length > 0);

const filtered = res.data.filter((p) => {

  const name = p.name?.toLowerCase() || "";
  const category = p.category?.toLowerCase() || "";
  const description = p.description?.toLowerCase() || "";

  return keywords.some((word) =>
    name.includes(word) ||
    category.includes(word) ||
    description.includes(word)
  );

});

        setProducts(filtered);

      } catch (error) {

        console.error("Search error:", error);

      }

    };

    fetchProducts();

  }, [query]);

  return (

    <div className="container">

      <h2 style={{marginBottom:"30px"}}>
        Search results for "{query}"
      </h2>

      {products.length === 0 ? (

        <p>No products found</p>

      ) : (

        <ProductGrid products={products} />

      )}

    </div>

  );

};

export default SearchResults;