import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "../styles/Admin.css"; 
import { API } from "../config";

import {
  BarChart, Bar, XAxis, YAxis, Tooltip
} from "recharts";

const AdminDashboard = () => {

  const navigate = useNavigate();
  const [categoryName, setCategoryName] = useState("");
const [categories, setCategories] = useState([]);

  const [products, setProducts] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [image, setImage] = useState([]);

  const [analytics, setAnalytics] = useState(null);

  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "",
    description: "",
    isCombo: false
  });

  /* ================= FETCH CATEGORIES ================= */

const fetchCategories = async () => {
  try {
    const res = await axios.get(`${API}/api/categories`);
    setCategories(res.data);
  } catch (error) {
    console.error("Category fetch error:", error);
  }
};

/* ================= ADD CATEGORY ================= */

const addCategory = async () => {
  if (!categoryName.trim()) return;

  try {
    await axios.post(`${API}/api/categories`, {
      name: categoryName,
    });

    setCategoryName("");
    fetchCategories();
    toast.success("Category Added ✅");
  } catch (error) {
    console.error(error);
    toast.error("Failed ❌");
  }
};

  /* ================= FETCH PRODUCTS ================= */

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get(
        `${API}/api/products`
      );
      setProducts(data);
    } catch (error) {
      console.error(error);
    }
  };

  /* ================= FETCH ANALYTICS ================= */

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        `${API}/api/orders/analytics`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setAnalytics(res.data);

    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
  fetchProducts();
  fetchAnalytics();
  fetchCategories(); // ✅ ADD THIS
}, []);

  /* ================= ADD PRODUCT ================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      const formData = new FormData();

      formData.append("name", form.name);
      formData.append("price", form.price);
      formData.append("category", form.category);
      formData.append("description", form.description);
      formData.append("sizes", JSON.stringify(sizes));
      formData.append("isCombo", form.isCombo);

      if (image && image.length > 0) {
        for (let i = 0; i < image.length; i++) {
          formData.append("images", image[i]);
        }
      }

      await axios.post(
        `${API}/api/products` ,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      toast.success("Product Added ✅");

      setForm({
        name: "",
        price: "",
        category: "",
        description: "",
        isCombo: false
      });

      setSizes([]);
      setImage([]);

      fetchProducts();

    } catch (error) {
      console.error(error);
      toast.error("Upload failed ❌");
    }
  };

  /* ================= DELETE PRODUCT ================= */

  const deleteProduct = async (id) => {

    try {
      const token = localStorage.getItem("token");

      await axios.delete(
        `${API}/api/products/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      toast.success("Product deleted 🗑️");

      fetchProducts();

    } catch (error) {
      console.error(error);
      toast.error("Delete failed ❌");
    }

  };

  /* ================= CHART DATA ================= */

  const chartData = analytics
    ? [
        { name: "Orders", value: analytics.totalOrders },
        { name: "Revenue", value: analytics.totalRevenue },
        { name: "Delivered", value: analytics.delivered }
      ]
    : [];

  /* ================= UI ================= */

  return (

    <div className="admin-container">

      <h1>Admin Dashboard</h1>

      {/* NAV BUTTONS */}

      <button onClick={() => navigate("/admin/orders")}>
        View Orders 📦
      </button>

      {/* ================= CATEGORY MANAGEMENT ================= */}

<div style={{ marginTop: 30 }}>

  <h2>Manage Categories 🏷️</h2>

  <input
    type="text"
    placeholder="Enter category"
    value={categoryName}
    onChange={(e) => setCategoryName(e.target.value)}
  />

  <button onClick={addCategory}>Add Category</button>

  <div style={{ marginTop: 10 }}>
    {categories.map((c) => (
      <p key={c._id}>{c.name}</p>
    ))}
  </div>

</div>

      {/* ================= ANALYTICS ================= */}

      {analytics && (
        <div style={{ marginTop: 30 }}>

          <h2>Analytics</h2>

          <BarChart width={400} height={300} data={chartData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" />
          </BarChart>

        </div>
      )}

      {/* ================= ADD PRODUCT ================= */}

      <form onSubmit={handleSubmit} className="admin-form">

        <input
          type="text"
          placeholder="Product Name"
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
          required
        />

        <input
          type="number"
          placeholder="Price"
          value={form.price}
          onChange={(e) =>
            setForm({ ...form, price: e.target.value })
          }
          required
        />

        <select
          value={form.category}
          onChange={(e) =>
            setForm({ ...form, category: e.target.value })
          }
          required
        >
          <option value="">Select Category</option>
          <option value="shirts">Shirts</option>
          <option value="t-shirts">T-Shirts</option>
          <option value="hoodies">Hoodies</option>
          <option value="jacket">Jacket</option>
          <option value="sweatshirts">Sweatshirts</option>
          <option value="jeans">Jeans</option>
          <option value="cargos">Cargos</option>
          <option value="joggers">Joggers</option>
          <option value="shorts">Shorts</option>
          <option value="formal">Formal</option>
          <option value="casual">Casual</option>
          <option value="combo">Combo</option>
        </select>

        <input
          type="file"
          multiple
          onChange={(e) => setImage(e.target.files)}
          required
        />

        <div>
          {["S","M","L","XL","XXL"].map(size => (
            <label key={size}>
              <input
                type="checkbox"
                value={size}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSizes([...sizes, size]);
                  } else {
                    setSizes(sizes.filter(s => s !== size));
                  }
                }}
              />
              {size}
            </label>
          ))}
        </div>

        <label>
          <input
            type="checkbox"
            checked={form.isCombo}
            onChange={(e) =>
              setForm({ ...form, isCombo: e.target.checked })
            }
          />
          Combo Product
        </label>

        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
        />

        <button type="submit">Add Product</button>

      </form>

      {/* ================= PRODUCT LIST ================= */}

      <div className="admin-products">

        {products.map((product) => (

          <div key={product._id} className="admin-product-card">

            <img
              src={`${API}${product.image}`}
              alt={product.name}
            />

            <h4>{product.name}</h4>
            <p>₹{product.price}</p>

            <button onClick={() => deleteProduct(product._id)}>
              Delete
            </button>

          </div>

        ))}

      </div>

    </div>

  );

};

export default AdminDashboard;
