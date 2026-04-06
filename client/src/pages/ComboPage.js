import { useEffect, useState } from "react";
import axios from "axios";
import ProductGrid from "../components/ProductGrid";
import { API } from "../config";
const ComboPage = () => {

  const [products, setProducts] = useState([]);

  useEffect(() => {

    const fetchProducts = async () => {

      try {

        const res = await axios.get(`${API}/api/products`);

        const comboProducts = res.data.filter((p) =>

          // 1️⃣ Category is combo
          p.category?.toLowerCase() === "combo"

          ||

          // 2️⃣ Product name contains "combo"
          p.name?.toLowerCase().includes("combo")

        );

        setProducts(comboProducts);

      } catch (error) {

        console.error("Combo fetch error:", error);

      }

    };

    fetchProducts();

  }, []);

  return (

    <div className="container">

      <h1 style={{ marginBottom: "30px" }}>
        Combo Collection
      </h1>

      {products.length === 0 ? (
        <p>No combo products available</p>
      ) : (
        <ProductGrid products={products} />
      )}

    </div>

  );

};

export default ComboPage;
