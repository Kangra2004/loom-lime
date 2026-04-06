import { useState } from "react";
import axios from "axios";
import "../styles/AuthModal.css";
import { API } from "../config";

const AuthModal = ({ closeModal }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  const submitHandler = async () => {
  try {
    const url = isLogin
      ? `${API}/api/auth/login`
      : `${API}/api/auth/register`;

    const { data } = await axios.post(url, form);

    localStorage.setItem("token", data.token);
    localStorage.setItem("userInfo", JSON.stringify(data));

    closeModal();
    window.location.reload();
  } catch (err) {
    console.log(err);
    alert("Authentication failed");
  }
};

  return (
    <div className="modal-overlay">
      <div className="auth-modal">

        <h2>{isLogin ? "Login" : "Register"}</h2>

        {!isLogin && (
          <input
            placeholder="Full Name"
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
          />
        )}

        <input
          placeholder="Email"
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        <input
          type="password"
          placeholder="Password"
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
        />

        <button onClick={submitHandler}>
          {isLogin ? "Login" : "Register"}
        </button>

        <p onClick={() => setIsLogin(!isLogin)}>
          {isLogin
            ? "New user? Register"
            : "Already have account? Login"}
        </p>

        <span className="close-btn" onClick={closeModal}>
          ✖
        </span>

      </div>
    </div>
  );
};

export default AuthModal;