import { useEffect, useState } from "react";
import axios from "axios";
import ProductGrid from "../components/ProductGrid";

const BottomWearPage = () => {

  const [products, setProducts] = useState([]);

  useEffect(() => {

    const fetchProducts = async () => {

      const res = await axios.get(
        `http://${API}:5000/api/products`
      );

      const bottomWear = res.data.filter((p) =>
        ["jeans","cargos","joggers","shorts"].includes(
          p.category
        )
      );

      setProducts(bottomWear);

    };

    fetchProducts();

  }, []);

  return (

    <div className="container">

      <h1>Bottom Wear</h1>

      <ProductGrid products={products} />

    </div>

  );

};

export default BottomWearPage;