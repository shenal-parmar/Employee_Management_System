// ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import axios from "axios";
const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL?.replace(/\/$/, '')}/api`,
});
export default function ProtectedRoute({ role, children }) {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("userRole");
  console.log("userRole : ",userRole);
  

  if (!token) return <Navigate to="/login" />;

  if (role && userRole !== role) return <Navigate to="/" />;

  return children;
}
