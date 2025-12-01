import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { userContext } from "../context/AuthContext.jsx";
import api from "../src/api/api.js";

export const submitLogin = async ({ email, password }) => {
  try {
    const res = await api.post(`/users/login`, { email, password });
    if (res.data.success) return res.data;
    else throw new Error("Login failed");
  } catch (err) {
    if (err.response?.data?.error) throw new Error(err.response.data.error);
    else throw new Error("Server error here");
  }
};

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const { login } = useContext(userContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await submitLogin({ email, password });
      localStorage.setItem("token", res.token);
      localStorage.setItem("user", JSON.stringify(res.user));
      localStorage.setItem("userRole", res.user.role);
      login(res.user);
      alert("Successfully login");
      if (res.user.role === "admin") navigate("/admin-dashboard");
      else navigate("/employee-dashboard");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-600 to-gray-100 p-4">
      <div className="w-full max-w-md bg-white/80 backdrop-blur-lg shadow-2xl rounded-2xl p-8 border border-white/20">
        <h2 className="text-3xl font-bold text-center text-teal-700 mb-6">
          Employee Management System
        </h2>

        <h3 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          Login to Continue
        </h3>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <p className="text-red-600 font-semibold text-center bg-red-100 py-2 rounded">
              {error}
            </p>
          )}

          <div>
            <label htmlFor="email" className="block text-gray-700 font-medium mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-gray-700 font-medium mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none sm:text-sm"
            />
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between text-sm gap-2 sm:gap-0">
            <label className="flex items-center space-x-2 text-gray-700">
              <input type="checkbox" className="h-4 w-4" />
              <span>Remember me</span>
            </label>
            <a className="text-teal-600 hover:underline cursor-pointer">Forgot Password?</a>
          </div>

          <button
            type="submit"
            className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3 rounded-lg text-lg transition-all duration-300 shadow-md hover:shadow-lg"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
