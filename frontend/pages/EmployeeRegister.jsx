import { useState } from "react";
import api from "../src/api/api.js";
import { useNavigate } from "react-router-dom";

export default function EmployeeRegister() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    designation: "",
    department: "",
    date_of_joining: "",
  });

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const formDataToSend = new FormData();
      Object.keys(form).forEach((key) => {
        formDataToSend.append(key, form[key]);
      });

      const res = await api.post("/employees", formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSuccess("Employee registered successfully!");
      setTimeout(() => {
        navigate("/");
      }, 1500);

      setForm({
        name: "",
        email: "",
        password: "",
        phone: "",
        designation: "",
        department: "",
        date_of_joining: "",
        profile_image: null,
      });
    } catch (err) {
      setError(err.response?.data?.message || "Server error");
    }
  };
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-600 to-gray-100 p-4 sm:p-6 md:p-10">
      <div className="w-full max-w-3xl bg-white/80 backdrop-blur-lg shadow-2xl rounded-2xl p-6 sm:p-8 border border-white/20">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-teal-700 mb-4">
          Employee Management System
        </h2>

        <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 text-center mb-6">
          Register New Employee
        </h3>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <p className="text-red-600 font-semibold text-center bg-red-100 py-2 rounded">
              {error}
            </p>
          )}

          {success && (
            <p className="text-green-600 font-semibold text-center bg-green-100 py-2 rounded">
              {success}
            </p>
          )}

          {/* Form Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Full Name */}
            <div className="col-span-1">
              <label className="block text-gray-700 font-medium mb-1">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                placeholder="Enter employee name"
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
              />
            </div>

            {/* Email */}
            <div className="col-span-1">
              <label className="block text-gray-700 font-medium mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="Enter employee email"
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
              />
            </div>

            {/* Password */}
            <div className="col-span-1">
              <label className="block text-gray-700 font-medium mb-1">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                placeholder="Set login password"
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
              />
            </div>

            {/* Phone */}
            <div className="col-span-1">
              <label className="block text-gray-700 font-medium mb-1">
                Phone Number
              </label>
              <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Enter phone"
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
              />
            </div>

            {/* Designation */}
            {/* <div className="col-span-1">
              <label className="block text-gray-700 font-medium mb-1">
                Designation
              </label>
              <input
                type="text"
                name="designation"
                value={form.designation}
                onChange={handleChange}
                placeholder="Ex: Software Developer"
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
              />
            </div> */}

            {/* Department*/}
            {/* <div className="col-span-1">
              <label className="block text-gray-700 font-medium mb-1">
                Department ID
              </label>
              <input
                type="text"
                name="department"
                value={form.department}
                onChange={handleChange}
                placeholder="Mongo ObjectID of department"
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
              />
            </div>  */}

            {/* Date of Joining */}
            <div className="col-span-1 sm:col-span-2">
              <label className="block text-gray-700 font-medium mb-1">
                Date of Joining
              </label>
              <input
                type="date"
                name="date_of_joining"
                value={form.date_of_joining}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
              />
            </div>

            {/* Profile Image */}
            <div className="col-span-1 sm:col-span-2">
              <label className="block text-gray-700 font-medium mb-1">
                Profile Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setForm({ ...form, profile_image: e.target.files[0] })
                }
                className="w-full px-4 py-3 border rounded-lg bg-white focus:ring-2 focus:ring-teal-500 outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3 rounded-lg text-lg transition-all duration-300 shadow-md hover:shadow-lg"
          >
            Register Employee
          </button>
        </form>
      </div>
    </div>
  );
}
