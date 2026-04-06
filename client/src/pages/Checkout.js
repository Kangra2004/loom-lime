import { useState, useEffect } from "react";
import "../styles/Checkout.css";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import axios from "axios";

import { API } from "../config";

const Checkout = () => {

  const navigate = useNavigate();
  const { cart, cartTotal, clearCart } = useCart();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    paymentMethod: "cod",
  });

  /* ================= AUTOFILL PROFILE ================= */

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");

        const { data } = await axios.get(
          `${API}/api/users/profile`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        setFormData((prev) => ({
          ...prev,
          name: data.name || "",
          phone: data.phone || "",
          email: data.email || "",
          city: data.city || "",
          address: data.addresses?.[0]?.address || ""
        }));

      } catch (error) {
        console.log(error);
      }
    };

    fetchProfile();
  }, []);

  /* ================= HANDLE INPUT ================= */

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  /* ================= VALIDATE ================= */

  const validateForm = () => {
    const { name, phone, address, city, state, pincode } = formData;

    if (!name || !phone || !address || !city || !state || !pincode) {
      alert("Please fill all required fields");
      return false;
    }

    return true;
  };

  /* ================= COD ORDER ================= */

  const handlePlaceOrder = async () => {

    if (!validateForm()) return;

    try {
      const token = localStorage.getItem("token");

      const formattedItems = cart.map(item => ({
        product: item.productId?._id,
        name: item.productId?.name,
        price: item.productId?.price,
        image: item.productId?.image,
        quantity: item.quantity
      }));

     if (!token) {
  alert("Please login again");
  return navigate("/login");
}

await axios.post(
  `${API}/api/orders`,
  {
    orderItems: formattedItems,
    shippingAddress: {
      address: formData.address,
      city: formData.city,
      postalCode: formData.pincode,
      country: "India"
    },
    totalPrice: cartTotal,
    isPaid: false,
  },
  {
    headers: {
      Authorization: `Bearer ${token}`
    },
  }
);

      await clearCart();

      alert("Order placed successfully!");
      navigate("/");

    } catch (error) {
      console.error(error);
      alert("Order failed");
    }
  };

  /* ================= ONLINE PAYMENT ================= */

  const handleOnlinePayment = async () => {

    if (!validateForm()) return;

    try {
      const token = localStorage.getItem("token");

      const { data } = await axios.post(
        `${API}/api/payment/create-order`,
        { amount: cartTotal },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const options = {
        key: "rzp_test_SHBgca45sYUifk",
        amount: data.amount,
        currency: "INR",
        order_id: data.id,
        name: "Loom & Line",
        description: "Order Payment",

        handler: async function (response) {

          const verify = await axios.post(
            `${API}/api/payment/verify`,
            response,
            {
              headers: { Authorization: `Bearer ${token}` }
            }
          );

          if (verify.data.success) {

            const formattedItems = cart.map(item => ({
              product: item.productId?._id,
              name: item.productId?.name,
              price: item.productId?.price,
              image: item.productId?.image,
              quantity: item.quantity
            }));

            if (!token) {
  alert("Session expired, login again");
  return navigate("/login");
}

            await axios.post(
              `${API}/api/orders`,
              {
                orderItems: formattedItems,
                shippingAddress: {
                  address: formData.address,
                  city: formData.city,
                  postalCode: formData.pincode,
                  country: "India"
                },
                totalPrice: cartTotal,
                isPaid: true,
              },
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );

            await clearCart();

            alert("Payment Successful!");
            navigate("/");

          } else {
            alert("Payment verification failed");
          }
        },

        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone,
        },

        theme: {
          color: "#111111",
        },
      };

      const razor = new window.Razorpay(options);
      razor.open();

    } catch (error) {
      console.error(error);
      alert("Payment failed");
    }
  };

  return (
    <div className="checkout-container">
      <h2>Checkout</h2>

      <div className="checkout-grid">

        <div className="checkout-card">
          <h3>Delivery Address</h3>

          <input name="name" value={formData.name} placeholder="Full Name" onChange={handleChange} />
          <input name="phone" value={formData.phone} placeholder="Phone Number" onChange={handleChange} />
          <input name="email" value={formData.email} placeholder="Email" onChange={handleChange} />
          <textarea name="address" value={formData.address} placeholder="Full Address" onChange={handleChange} />

          <div className="row">
            <input name="city" value={formData.city} placeholder="City" onChange={handleChange} />
            <input name="state" value={formData.state} placeholder="State" onChange={handleChange} />
          </div>

          <input name="pincode" value={formData.pincode} placeholder="Pincode" onChange={handleChange} />
        </div>

        <div className="checkout-card">
          <h3>Order Summary</h3>

          {cart.map((item) => (
            <div className="summary-item" key={item._id}>
              <div className="summary-product">
                <img
                  src={`${API}${item.productId?.image}`}
                  alt={item.productId?.name}
                />
                <div className="summary-details">
                  <strong>{item.productId?.name}</strong>
                  <p>Qty: {item.quantity}</p>
                </div>
              </div>

              <div className="summary-price">
                ₹{(item.productId?.price || 0) * item.quantity}
              </div>
            </div>
          ))}

          <hr />

          <div className="summary-total">
            <strong>Total</strong>
            <strong>₹{cartTotal}</strong>
          </div>

          <h4>Payment Method</h4>

          <label>
            <input
              type="radio"
              name="paymentMethod"
              value="cod"
              checked={formData.paymentMethod === "cod"}
              onChange={handleChange}
            />
            Cash on Delivery
          </label>

          <label>
            <input
              type="radio"
              name="paymentMethod"
              value="online"
              checked={formData.paymentMethod === "online"}
              onChange={handleChange}
            />
            Online Payment
          </label>

          <button
            onClick={
              formData.paymentMethod === "cod"
                ? handlePlaceOrder
                : handleOnlinePayment
            }
          >
            Place Order
          </button>

        </div>
      </div>
    </div>
  );
};

export default Checkout;