import React, { useEffect, useState } from "react";
import { getCurrentUser } from "../src/api/userApi";
import { useQuery } from "@tanstack/react-query";
import {
  FaCalendarAlt,
  FaDollarSign,
  FaCheckCircle,
  FaExclamationCircle,
  FaClock,
  FaChartBar,
} from "react-icons/fa";
import { format } from "date-fns";
import axios from "axios";
const BACKEND_URL = `${import.meta.env.VITE_BACKEND_URL}`;

export default function EmployeeDashboard() {
  const [user, setUser] = useState(null);
  const id = localStorage.getItem("user");
  console.log("user at dashboard : ", id);

  // ✅ Get logged-in user details
  useEffect(() => {
    const fetchUser = async () => {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    };
    fetchUser();
  }, []);

  // ✅ Fetch employee’s own leaves
  const { data: leaves = [] } = useQuery({
    queryKey: ["myLeaves"],
    queryFn: async () => {
      const res = await axios.get(`${BACKEND_URL}/leaves/my-leaves/${id}`);
      return res.data || [];
    },
  });

  // ✅ Fetch employee’s salary details
  const { data: salaries = [] } = useQuery({
    queryKey: ["mySalaries"],
    queryFn: async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/salaries/my-salary/${id}`
        );
        // console.log("salary :",res);f

        return res.data || [];
      } catch (err) {
        console.error("Error fetching salary:", err);
        return [];
      }
    },
  });

  // ✅ Stats summary for this employee
  const pendingLeaves = leaves.filter((l) => l.status === "Pending");
  const approvedLeaves = leaves.filter((l) => l.status === "Approved");
  const rejectedLeaves = leaves.filter((l) => l.status === "Rejected");

  const totalPaidSalary = salaries
    .filter((s) => s.status === "Paid")
    .reduce((sum, s) => sum + (s.total || 0), 0);

  const recentActivities = [
    ...leaves.map((l) => ({
      title: `Leave ${l.status}`,
      description: `${l.leave_type} - ${l.reason || "N/A"}`,
      time: l.created_date,
      icon:
        l.status === "Approved" ? (
          <FaCheckCircle className="text-green-600" />
        ) : l.status === "Rejected" ? (
          <FaExclamationCircle className="text-red-600" />
        ) : (
          <FaClock className="text-orange-600" />
        ),
    })),
  ].sort((a, b) => new Date(b.time) - new Date(a.time));
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    leave_type: "",
    from_date: "",
    to_date: "",
    description: "",
  });
  const submitLeave = async () => {
    try {
      await axios.post(`${BACKEND_URL}/leaves`, {
        emp_id: id,
        employee_name: user?.name,
        leave_type: form.leave_type,
        from_date: form.from_date,
        to_date: form.to_date,
        description: form.description,
      });

      alert("Leave request submitted!");
      setShowForm(false);
    } catch (err) {
      console.error("Error submitting leave:", err);
      alert("Error submitting leave");
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-8 bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen">
      <div className="max-w-5xl mx-auto">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome, {user?.full_name || "Employee"} 👋
          </h1>
          <p className="text-gray-600">
            Here’s an overview of your work, leaves, and salary.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white shadow-md rounded-xl p-6 flex flex-col items-center hover:shadow-lg transition">
            <FaCalendarAlt className="text-blue-600 text-3xl mb-2" />
            <p className="text-gray-500 text-sm">Pending Leaves</p>
            <p className="text-2xl font-bold text-gray-900">
              {pendingLeaves.length}
            </p>
          </div>

          <div className="bg-white shadow-md rounded-xl p-6 flex flex-col items-center hover:shadow-lg transition">
            <FaCheckCircle className="text-green-600 text-3xl mb-2" />
            <p className="text-gray-500 text-sm">Approved Leaves</p>
            <p className="text-2xl font-bold text-gray-900">
              {approvedLeaves.length}
            </p>
          </div>

          <div className="bg-white shadow-md rounded-xl p-6 flex flex-col items-center hover:shadow-lg transition">
            <FaDollarSign className="text-purple-600 text-3xl mb-2" />
            <p className="text-gray-500 text-sm">Total Salary Received</p>
            <p className="text-2xl font-bold text-gray-900">
              ${totalPaidSalary.toLocaleString()}
            </p>
          </div>
        </div>

        {/* My Leaves Section */}
        <div className="bg-white shadow-lg rounded-xl p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <FaCalendarAlt className="text-blue-600" /> My Leaves
          </h2>
          <button
            onClick={() => setShowForm(true)}
            className="mb-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Apply for Leave
          </button>

          {leaves.length === 0 ? (
            <p className="text-gray-500 text-center">No leave records yet.</p>
          ) : (
            <table className="w-full text-sm text-left border">
              <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
                <tr>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">From</th>
                  <th className="px-4 py-3">To</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {leaves.map((l, i) => (
                  <tr key={i} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-2">{l.leave_type}</td>
                    <td className="px-4 py-2">
                      {format(new Date(l.from_date), "MMM dd, yyyy")}
                    </td>
                    <td className="px-4 py-2">
                      {format(new Date(l.to_date), "MMM dd, yyyy")}
                    </td>
                    <td
                      className={`px-4 py-2 font-semibold ${
                        l.status === "Approved"
                          ? "text-green-600"
                          : l.status === "Rejected"
                          ? "text-red-600"
                          : "text-orange-500"
                      }`}
                    >
                      {l.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Salary Section */}
        <div className="bg-white shadow-lg rounded-xl p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <FaDollarSign className="text-green-600" /> Salary Details
          </h2>
          {salaries.length === 0 ? (
            <p className="text-gray-500 text-center">No salary records yet.</p>
          ) : (
            <table className="w-full text-sm text-left border">
              <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
                <tr>
                  <th className="px-4 py-3">Month</th>
                  <th className="px-4 py-3">Total</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {salaries.map((s, i) => (
                  <tr key={i} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-2">{s.month || "-"}</td>
                    <td className="px-4 py-2">${s.total?.toLocaleString()}</td>
                    <td
                      className={`px-4 py-2 font-semibold ${
                        s.status === "Paid"
                          ? "text-green-600"
                          : "text-orange-500"
                      }`}
                    >
                      {s.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Recent Activity */}
        <div className="bg-white shadow-lg rounded-xl p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <FaChartBar className="text-blue-600" /> Recent Activity
          </h2>
          <div className="space-y-3">
            {recentActivities.length === 0 ? (
              <p className="text-gray-500 text-center">No recent updates.</p>
            ) : (
              recentActivities.slice(0, 5).map((a, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50"
                >
                  <div className="flex-shrink-0">{a.icon}</div>
                  <div className="flex-1">
                    <p className="text-gray-800 font-medium">{a.title}</p>
                    <p className="text-gray-500 text-sm">{a.description}</p>
                    <p className="text-gray-400 text-xs">
                      {a?.time
                        ? format(new Date(a.time), "MMM dd, h:mm a")
                        : "-"}
                    </p>
                  </div>
                </div>
              ))
            )}
            {showForm && (
              <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                  <h2 className="text-xl font-semibold mb-4">
                    Apply for Leave
                  </h2>

                  {/* Leave Type */}
                  <select
                    className="w-full p-2 border rounded mb-3"
                    value={form.leave_type}
                    onChange={(e) =>
                      setForm({ ...form, leave_type: e.target.value })
                    }
                  >
                    <option value="">Select Leave Type</option>
                    <option value="Sick Leave">Sick Leave</option>
                    <option value="Casual Leave">Casual Leave</option>
                    <option value="Paid Leave">Paid Leave</option>
                    <option value="Unpaid Leave">Unpaid Leave</option>
                  </select>

                  {/* Dates */}
                  <input
                    type="date"
                    className="w-full p-2 border rounded mb-3"
                    value={form.from_date}
                    onChange={(e) =>
                      setForm({ ...form, from_date: e.target.value })
                    }
                  />

                  <input
                    type="date"
                    className="w-full p-2 border rounded mb-3"
                    value={form.to_date}
                    onChange={(e) =>
                      setForm({ ...form, to_date: e.target.value })
                    }
                  />

                  {/* Description */}
                  <textarea
                    className="w-full p-2 border rounded mb-3"
                    rows="3"
                    placeholder="Reason for leave"
                    value={form.description}
                    onChange={(e) =>
                      setForm({ ...form, description: e.target.value })
                    }
                  ></textarea>

                  {/* Buttons */}
                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => setShowForm(false)}
                      className="px-4 py-2 bg-gray-300 rounded"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={submitLeave}
                      className="px-4 py-2 bg-blue-600 text-white rounded"
                    >
                      Submit
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
