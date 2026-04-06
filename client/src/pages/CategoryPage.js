import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import ProductGrid from "../components/ProductGrid";
import { API } from "../config";

const CategoryPage = () => {

  const { type } = useParams();
  const [products, setProducts] = useState([]);

  useEffect(() => {

    const fetchProducts = async () => {

      try {

        const res = await axios.get(`${API}/api/products`);

        const filtered = res.data.filter(
          (p) =>
            p.category &&
            p.category.toLowerCase() === type.toLowerCase()
        );

        setProducts(filtered);

      } catch (error) {

        console.error("Category fetch error", error);

      }

    };

    fetchProducts();

  }, [type]);

  return (

<div className="container category-page">
  
      <h1 style={{ marginBottom: "30px" }}>
        {type.toUpperCase()}
      </h1>

      {products.length === 0 ? (
        <p>No products found</p>
      ) : (
        <ProductGrid products={products} />
      )}

    </div>

  );

};

export default CategoryPage;
