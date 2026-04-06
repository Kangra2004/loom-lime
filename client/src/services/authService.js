import axios from "axios";
import { API } from "../config";

const API_URL = `${API}/api/auth`;

export const loginUser = async (data) => {
  const res = await axios.post(`${API_URL}/login`, data);
  return res.data;
};

export const registerUser = async (data) => {
  const res = await axios.post(`${API_URL}/register`, data);
  return res.data;
};