import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import "../styles/Profile.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API } from "../config";

const Profile = () => {

  const { user, logout } = useAuth();
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);

  const [profile, setProfile] = useState({
    name: "",
    phone: "",
    city: "",
    avatar: ""
  });

  const [addresses, setAddresses] = useState([]);
  const [newAddress, setNewAddress] = useState("");
  const [orders, setOrders] = useState([]);

  /* ================= FETCH PROFILE ================= */

  useEffect(() => {

    const fetchProfile = async () => {

      try {
        const { data } = await axios.get(
          `${API}/api/users/profile`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        setProfile(data);
        setAddresses(data.addresses || []);

      } catch (err) {
        console.log(err);
      }

    };

    if (token) fetchProfile();

  }, [token]);

  /* ================= FETCH ORDERS ================= */

  useEffect(() => {

    const fetchOrders = async () => {

      try {
        const { data } = await axios.get(
          `${API}/api/orders/myorders`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        setOrders(data);

      } catch (err) {
        console.log(err);
      }

    };

    if (token) fetchOrders();

  }, [token]);

  /* ================= SAVE PROFILE ================= */

  const saveProfile = async () => {

    try {
      const { data } = await axios.put(
        `${API}/api/users/profile`,
        { ...profile, addresses },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setProfile(data);
      setIsEditing(false);
      alert("Profile Updated ✅");

    } catch (err) {
      console.log(err);
    }

  };

  /* ================= AVATAR UPLOAD ================= */

  const handleAvatar = async (e) => {

    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      const { data } = await axios.put(
        `${API}/api/users/profile`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setProfile(data);

    } catch (err) {
      console.log(err);
    }

  };

  /* ================= ADDRESS ================= */

  const addAddress = () => {
    if (!newAddress) return;
    setAddresses([...addresses, { address: newAddress }]);
    setNewAddress("");
  };

  const deleteAddress = (index) => {
    setAddresses(addresses.filter((_, i) => i !== index));
  };

  /* ================= DARK MODE ================= */

  const toggleTheme = () => {
    document.body.classList.toggle("dark-mode");
  };

  return (

    <div className="profile-page">

      <div className="profile-card">

        {/* AVATAR */}
        <div className="avatar-section">
          <img
            src={
              profile.avatar
                ? `${API}${profile.avatar}`
                : "/images/default-avatar.png"
            }
            alt="avatar"
          />

          {isEditing && (
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatar}
            />
          )}
        </div>

        {/* PROFILE INFO */}
        <div className="profile-header">

          {isEditing ? (
            <>
              <input
                value={profile.name}
                onChange={(e) =>
                  setProfile({ ...profile, name: e.target.value })
                }
              />
              <input
                value={profile.phone}
                onChange={(e) =>
                  setProfile({ ...profile, phone: e.target.value })
                }
              />
              <input
                value={profile.city}
                onChange={(e) =>
                  setProfile({ ...profile, city: e.target.value })
                }
              />
            </>
          ) : (
            <>
              <h2>{profile.name || "Your Name"}</h2>
              <p>{profile.phone}</p>
              <p>{profile.city}</p>
            </>
          )}

        </div>

        {/* BUTTONS */}
        <div className="profile-buttons">

          {isEditing ? (
            <button onClick={saveProfile}>Save</button>
          ) : (
            <button onClick={() => setIsEditing(true)}>
              Edit Profile
            </button>
          )}

          {user?.role === "admin" && (
            <button onClick={() => navigate("/admin")}>
              Admin Panel
            </button>
          )}

          <button
            onClick={() => {
              logout();
              navigate("/login");
            }}
          >
            Logout
          </button>

          <button onClick={toggleTheme}>
            Toggle Dark Mode
          </button>

        </div>

        {/* ADDRESS */}
        <div className="address-section">

          <h3>Saved Addresses</h3>

          {addresses.map((addr, index) => (
            <div key={index}>
              <p>{addr.address}</p>
              {isEditing && (
                <button onClick={() => deleteAddress(index)}>
                  Delete
                </button>
              )}
            </div>
          ))}

          {isEditing && (
            <>
              <input
                value={newAddress}
                onChange={(e) => setNewAddress(e.target.value)}
              />
              <button onClick={addAddress}>Add</button>
            </>
          )}

        </div>

        {/* ORDERS */}
        <div className="orders-section">

          <h3>My Orders</h3>

          {orders.length === 0 ? (
            <p>No orders yet</p>
          ) : (
            orders.map((order) => (

              <div key={order._id}>

                <p>Order ID: {order._id.slice(-6)}</p>

                <div>
                  {order.orderItems.slice(0, 2).map((item, index) => (
                    <img
                      key={index}
                      src={
  item.image?.startsWith("http")
    ? item.image
    : `${API}${item.image}`
}
                      alt={item.name}
                    />
                  ))}
                </div>

                <p>Total: ₹{order.totalPrice}</p>

              </div>

            ))
          )}

        </div>

      </div>

    </div>
  );
};

export default Profile;