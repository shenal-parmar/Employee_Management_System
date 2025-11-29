import React, { useEffect, useState } from "react";
import { getCurrentUser } from "../src/api/userApi";
import { FaUserCircle, FaEnvelope, FaPhone, FaBuilding } from "react-icons/fa";
import { useAuth } from "../context/AuthContext"; // <-- import Auth context
import { useParams, useNavigate, data } from "react-router-dom"; // if route has userId
// import api from "../src/api/api.js";
export default function Profile() {
  const [user, setUser] = useState(null);
  const { user: loggedInUser, Loading } = useAuth(); // from AuthContext
  const { id } = useParams(); // assuming /profile/:id route
  const navigate = useNavigate();

  useEffect(() => {
    const fetch = async () => {
      const data = await getCurrentUser(id); // fetch specific user's profile
      setUser(data);
    };
    fetch();
  }, [id]);
  console.log("profile page:", data);

  // Loading state
  if (Loading) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-500">
        Verifying user...
      </div>
    );
  }


  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-500">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-md">
        <div className="flex flex-col items-center mb-6">
          {user.profile_image ? (
            <img
              src={`${import.meta.env.VITE_BACKEND_URL}${user.profile_image}`}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover border-2 border-blue-500 mb-2"
            />
          ) : (
            <FaUserCircle className="text-6xl text-blue-600 mb-2" />
          )}

          <h2 className="text-2xl font-bold text-gray-800">{user.full_name}</h2>
          <p className="text-gray-500">{user.name || "Employee"}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="flex items-center gap-3">
            <FaEnvelope className="text-gray-500 text-xl" />
            <p className="text-gray-700">{user.email}</p>
          </div>
          <div className="flex items-center gap-3">
            <FaPhone className="text-gray-500 text-xl" />
            <p className="text-gray-700">{user.phone || "Not provided"}</p>
          </div>
          <div className="flex items-center gap-3">
            <FaBuilding className="text-gray-500 text-xl" />
            <p className="text-gray-700">{user.department || "N/A"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
