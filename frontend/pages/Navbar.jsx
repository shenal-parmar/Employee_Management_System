import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle, FaBars, FaTimes } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
// import { io } from "socket.io-client";

// const socket =  io(`${import.meta.env.VITE_API_URL?.replace(/\/$/, '')}`, {
//   transports: ["websocket"],
// });

export default function Navbar() {
  const [notifications, setNotifications] = useState([]);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  // useEffect(() => {
  //   socket.on("notification", (data) => {
  //     setNotifications((prev) => [data, ...prev]);
  //   });
  //   return () => socket.off("notification");
  // }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-md px-4 sm:px-6 py-4 flex justify-between items-center border-b border-teal-100 relative">
      {/* Brand */}
      <h1
        className="py-6 text-xl sm:text-2xl font-bold text-teal-700 cursor-pointer hover:text-teal-800 transition"
        onClick={() => navigate("/")}
      >
     <img
  src="/image2.avif"
  alt="emslogo"
  className="absolute top-2 h-16 w-auto object-contain" 
/> 
      </h1>

      {/* Desktop Menu */}
      <div className="hidden md:flex items-center gap-6">
        {/* <button className="relative flex items-center gap-1">
          🔔 {notifications.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
              {notifications.length}
            </span>
          )}
        </button> */}

        {user && (
          <Link
            to={user.role === "admin" ? "/admin-dashboard" : "/employee-dashboard"}
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
        <div className="absolute top-16 right-4 bg-white/90 backdrop-blur-lg shadow-xl rounded-xl border border-teal-100 w-56 flex flex-col py-3 animate-slideDown z-50">
          <button className="flex items-center justify-between px-4 py-2 text-gray-700 hover:bg-teal-50 rounded-lg">
            🔔 {notifications.length}
          </button>

          {user && (
            <Link
              to={user.role === "admin" ? "/admin-dashboard" : "/employee-dashboard"}
              onClick={() => setMenuOpen(false)}
              className="px-4 py-2 hover:bg-teal-50 text-gray-700 rounded-lg"
            >
              Dashboard
            </Link>
          )}

          {user ? (
            <>
              <Link
                to={`/profile/${user._id}`}
                onClick={() => setMenuOpen(false)}
                className="px-4 py-2 hover:bg-teal-50 text-gray-700 rounded-lg"
              >
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-left text-red-600 hover:bg-red-50 rounded-lg w-full"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="px-4 py-2 hover:bg-teal-50 text-gray-700 rounded-lg"
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={() => setMenuOpen(false)}
                className="px-4 py-2 hover:bg-teal-50 text-gray-700 rounded-lg"
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
