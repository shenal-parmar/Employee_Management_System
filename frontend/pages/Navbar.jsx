import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle, FaBars, FaTimes } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
// import api from "../src/api/api.js";
export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-md px-6 py-4 flex justify-between items-center border-b border-teal-100">
      {/* Brand */}
      <h1
        className="text-2xl font-bold text-teal-700 cursor-pointer hover:text-teal-800 transition"
        onClick={() => navigate("/")}
      >
        HR Portal
      </h1>

      {/* Desktop Menu */}
      <div className="hidden md:flex items-center gap-8">
        {user && (
          <Link
            to={
              user.role === "admin"
                ? "/admin-dashboard"
                : "/employee-dashboard"
            }
            className="text-gray-700 hover:text-teal-600 font-medium transition"
          >
            Dashboard
          </Link>
        )}

        {!user && (
          <Link
            to="/employeeRegister"
            className="text-gray-700 hover:text-teal-600 font-medium transition"
          >
            Register
          </Link>
        )}

        {user ? (
          <>
            <Link
              to={`/profile/${user._id}`}
              className="text-gray-700 hover:text-teal-600 font-medium transition"
            >
              Profile
            </Link>

            <button
              onClick={handleLogout}
              className="text-red-600 hover:text-red-800 font-medium transition"
            >
              Logout
            </button>
          </>
        ) : (
          <Link
            to="/login"
            className="text-gray-700 hover:text-teal-600 font-medium transition"
          >
            Login
          </Link>
        )}
      </div>

      {/* Mobile Menu Icon */}
      <button
        className="md:hidden text-3xl text-teal-700"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="absolute top-16 right-4 bg-white/90 backdrop-blur-lg shadow-xl rounded-xl border border-teal-100 w-56 flex flex-col py-3 animate-slideDown">
          {user && (
            <Link
              to={
                user.role === "admin"
                  ? "/admin-dashboard"
                  : "/employee-dashboard"
              }
              onClick={() => setMenuOpen(false)}
              className="px-4 py-2 hover:bg-teal-50 text-gray-700 transition rounded-lg"
            >
              Dashboard
            </Link>
          )}

          {user ? (
            <>
              <Link
                to={`/profile/${user._id}`}
                onClick={() => setMenuOpen(false)}
                className="px-4 py-2 hover:bg-teal-50 text-gray-700 transition rounded-lg"
              >
                Profile
              </Link>

              <button
                onClick={handleLogout}
                className="text-left w-full px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="px-4 py-2 hover:bg-teal-50 text-gray-700 transition rounded-lg"
              >
                Login
              </Link>

              <Link
                to="/register"
                onClick={() => setMenuOpen(false)}
                className="px-4 py-2 hover:bg-teal-50 text-gray-700 transition rounded-lg"
              >
                Register
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
