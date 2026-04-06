import { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { loginUser } from "../services/authService";
import "../styles/Auth.css";
import { useCart } from "../context/CartContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();
  const location = useLocation();
  const { fetchCart } = useCart();

 const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const data = await loginUser({ email, password });

    login(data);

    // Fetch user's cart after login
    await fetchCart(data._id);

    const redirectPath = location.state?.from || "/";
    navigate(redirectPath);

  } catch (err) {
    alert("Invalid credentials");
  }
};

  return (
    <div className="auth-wrapper">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h2>Welcome Back 👋</h2>
        <p className="auth-subtitle">Login to your account</p>

        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Login</button>

        <p className="auth-footer">
          Don’t have an account? <Link to="/register">Register</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
