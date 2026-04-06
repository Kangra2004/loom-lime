import { useEffect, useState } from "react";
import axios from "axios";
import ProductGrid from "../components/ProductGrid";

const TopWearPage = () => {

  const [products, setProducts] = useState([]);

  useEffect(() => {

    const fetchProducts = async () => {

      const res = await axios.get(
        `http://${API}:5000/api/products`
      );

      const topWear = res.data.filter((p) =>
        ["shirts","t-shirts","hoodies","jacket","sweatshirts"].includes(
          p.category
        )
      );

      setProducts(topWear);

    };

    fetchProducts();

  }, []);

  return (

    <div className="container">

      <h1>Top Wear</h1>

      <ProductGrid products={products} />

    </div>

  );

};

export default TopWearPage;