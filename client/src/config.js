export const API = window.location.hostname === "localhost"
  ? "http://localhost:5000"
  : `http://${window.location.hostname}:5000`;