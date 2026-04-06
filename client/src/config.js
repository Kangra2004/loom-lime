export const API = window.location.hostname === "localhost"
  ? "https://loom-lime-backend.onrender.com"
  : `http://${window.location.hostname}:5000`;