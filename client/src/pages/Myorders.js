import { useEffect, useState } from "react";
import axios from "axios";
import { API } from "../config";

const MyOrders = () => {

  const [orders, setOrders] = useState([]);
  const [cancelId, setCancelId] = useState(null);
  const [returnId, setReturnId] = useState(null);
  const [reason, setReason] = useState("");

  /* ================= FETCH ORDERS ================= */

  useEffect(() => {

    const fetchOrders = async () => {

      try {
        const token = localStorage.getItem("token");

        const { data } = await axios.get(
          `http://${API}:5000/api/orders/myorders`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        setOrders(data);

      } catch (error) {
        console.error(error);
      } 

    };

    fetchOrders();

  }, []);

  /* ================= CANCEL ORDER ================= */

  const cancelOrder = async (id) => {

    try {

      const token = localStorage.getItem("token");

      await axios.put(
        `http://${API}:5000/api/orders/${id}/cancel`,
        { reason },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      alert("Order cancelled");
      window.location.reload();

    } catch (error) {
      console.error(error);
    }

  };

  /* ================= RETURN ORDER ================= */

  const requestReturn = async (id) => {

    try {

      const token = localStorage.getItem("token");

      await axios.put(
        `http://${API}:5000/api/orders/${id}/return`,
        { reason },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      alert("Return request submitted");
      window.location.reload();

    } catch (error) {
      console.error(error);
    }

  };

  /* ================= TIMELINE ================= */

  const steps = [
    "Processing",
    "Packed",
    "Shipped",
    "Out for Delivery",
    "Delivered"
  ];

  const renderTimeline = (status) => {

    const currentStep = steps.indexOf(status);

    return (
      <div style={{ display: "flex", marginTop: 20 }}>
        {steps.map((step, index) => {

          const active = index <= currentStep;

          return (
            <div key={step} style={{ flex: 1, textAlign: "center" }}>
              <div style={{
                width: 18,
                height: 18,
                borderRadius: "50%",
                margin: "0 auto",
                background: active ? "black" : "#ccc"
              }} />
              <p style={{ fontSize: 12 }}>{step}</p>
            </div>
          );

        })}
      </div>
    );

  };

  const getDeliveryDate = (createdAt) => {
    const date = new Date(createdAt);
    date.setDate(date.getDate() + 5);
    return date.toDateString();
  };

  /* ================= UI ================= */

  return (

    <div style={{ padding: 40 }}>

      <h2>My Orders</h2>

      {orders.map((order) => (

        <div key={order._id} style={{
          marginBottom: 40,
          padding: 20,
          border: "1px solid #ddd"
        }}>

          <p><strong>Total:</strong> ₹{order.totalPrice}</p>
          <p><strong>Status:</strong> {order.status}</p>

          {/* TIMELINE */}
          {order.status !== "Cancelled" && renderTimeline(order.status)}

          <p>
            Expected Delivery: <strong>{getDeliveryDate(order.createdAt)}</strong>
          </p>

          {/* CANCEL BUTTON */}
          {order.status !== "Delivered" && order.status !== "Cancelled" && (
            <button onClick={() => setCancelId(order._id)}>
              Cancel Order
            </button>
          )}

          {/* RETURN BUTTON */}
          {order.status === "Delivered" && order.returnStatus === "None" && (
            <button onClick={() => setReturnId(order._id)}>
              Return Order
            </button>
          )}

          {/* CANCEL UI */}
          {cancelId === order._id && (

            <div style={{ marginTop: 10 }}>

              <select onChange={(e) => setReason(e.target.value)}>
                <option>Select reason</option>
                <option>Ordered by mistake</option>
                <option>Found cheaper elsewhere</option>
                <option>Delivery too late</option>
                <option>Other</option>
              </select>

              <button onClick={() => cancelOrder(order._id)}>
                Submit Cancel
              </button>

            </div>

          )}

          {/* RETURN UI */}
          {returnId === order._id && (

            <div style={{ marginTop: 10 }}>

              <select onChange={(e) => setReason(e.target.value)}>
                <option>Select reason</option>
                <option>Wrong product</option>
                <option>Damaged product</option>
                <option>Size issue</option>
                <option>Other</option>
              </select>

              <button onClick={() => requestReturn(order._id)}>
                Submit Return
              </button>

            </div>

          )}

          {/* STATUS */}
          {order.returnStatus !== "None" && (
            <p><strong>Return Status:</strong> {order.returnStatus}</p>
          )}

          {order.status === "Cancelled" && (
            <p><strong>Cancel Reason:</strong> {order.cancelReason}</p>
          )}

        </div>

      ))}

    </div>

  );

};

export default MyOrders;
