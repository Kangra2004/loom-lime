import axios from "axios";

const API = `http://${API}:5000/api/products`;

export const getAllProducts = async () => {
  const res = await axios.get(API);
  return res.data;
};

export const getProductsByCategory = async (category) => {
  const res = await axios.get(`${API}/category/${category}`);
  return res.data;
};
