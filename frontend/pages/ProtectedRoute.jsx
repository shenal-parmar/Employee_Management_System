// ProtectedRoute.jsx
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ role, children }) {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("userRole");
  // console.log("userRole : ",userRole);
  

  if (!token) return <Navigate to="/login" />;

  if (role && userRole !== role) return <Navigate to="/" />;

  return children;
}
