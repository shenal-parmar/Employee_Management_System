import axios from "axios";

// const API_URL = "http://localhost:3000/api/users";
const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL?.replace(/\/$/, '')}/api`,
});
// store token after login
export const loginUser = async (email, password) => {
  const res = await api.post(`/users/login`, { email, password });
  localStorage.setItem("token", res.data.token);
  return res.data.user;
};

export const getCurrentUser = async () => {
  const token = localStorage.getItem("token");
  if (!token) return null;
  console.log(token);
  

  const res = await api.get(`/users/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
