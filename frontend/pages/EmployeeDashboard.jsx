/* FULLY RESPONSIVE VERSION - CLEANED & IMPROVED */

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
import api from "../src/api/api.js";
import { io } from "socket.io-client";
import { toast } from "react-toastify";

export default function EmployeeDashboard() {
  const [user, setUser] = useState(null);
  const user1 = JSON.parse(localStorage.getItem("user"));
  const { id } = user1;

  const socket = io(`${import.meta.env.VITE_API_URL?.replace(/\/$/, '')}`, {
  transports: ["websocket"],
});

  useEffect(() => {
    const fetchUser = async () => {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    };
    fetchUser();
    socket.on("notification", (data) => {
      toast.info(data.message);
    });
    return () => socket.off("notification");
  }, []);

  const { data: leaves = [] } = useQuery({
    queryKey: ["myLeaves"],
    queryFn: async () => {
      const res = await api.get(`/leaves/my-leaves/${id}`);
      return res.data || [];
    },
  });

  const { data: salaries = [] } = useQuery({
    queryKey: ["mySalaries"],
    queryFn: async () => {
      try {
        const res = await api.get(`/salaries/my-salary/${id}`);
        return res.data || [];
      } catch {
        return [];
      }
    },
  });

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
    const today = new Date().setHours(0, 0, 0, 0);
    const from = new Date(form.from_date).setHours(0, 0, 0, 0);
    const to = new Date(form.to_date).setHours(0, 0, 0, 0);

    if (from < today) return alert("From date cannot be before today.");
    if (to < from) return alert("To date must be after or same as From date.");

    const days = Math.floor((to - from) / (1000 * 60 * 60 * 24)) + 1;

    try {
      await api.post(`/leaves`, {
        emp_id: id,
        employee_name: user?.name,
        leave_type: form.leave_type,
        from_date: form.from_date,
        to_date: form.to_date,
        description: form.description,
        days,
      });

      alert(`Leave submitted successfully for ${days} day(s)!`);
      setShowForm(false);
    } catch {
      alert("Error submitting leave");
    }
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-8 bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen">
      <div className="max-w-5xl mx-auto">
        
        {/* Welcome */}
        <div className="mb-6 text-center sm:text-left">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Welcome, {user?.name || "Employee"} 👋
          </h1>
          <p className="text-gray-600 mt-1">
            Here’s an overview of your work, leaves, and salary.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          <div className="bg-white shadow-md rounded-xl p-5 text-center">
            <FaCalendarAlt className="text-blue-600 text-3xl mb-2 mx-auto" />
            <p className="text-gray-500 text-sm">Pending Leaves</p>
            <p className="text-2xl font-bold">{pendingLeaves.length}</p>
          </div>

          <div className="bg-white shadow-md rounded-xl p-5 text-center">
            <FaCheckCircle className="text-green-600 text-3xl mb-2 mx-auto" />
            <p className="text-gray-500 text-sm">Approved Leaves</p>
            <p className="text-2xl font-bold">{approvedLeaves.length}</p>
          </div>

          <div className="bg-white shadow-md rounded-xl p-5 text-center">
            <FaDollarSign className="text-purple-600 text-3xl mb-2 mx-auto" />
            <p className="text-gray-500 text-sm">Total Salary Received</p>
            <p className="text-2xl font-bold">
              ${totalPaidSalary.toLocaleString()}
            </p>
          </div>
        </div>

        {/* My Leaves */}
        <div className="bg-white shadow-lg rounded-xl p-6 mt-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
            <h2 className="text-lg sm:text-xl font-semibold flex items-center gap-2">
              <FaCalendarAlt className="text-blue-600" /> My Leaves
            </h2>

            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg w-full sm:w-auto"
            >
              Apply for Leave
            </button>
          </div>

          {/* Responsive Table */}
          <div className="overflow-x-auto">
            {leaves.length === 0 ? (
              <p className="text-gray-500 text-center">No leave records yet.</p>
            ) : (
              <table className="w-full text-sm border">
                <thead className="bg-gray-100 text-xs uppercase">
                  <tr>
                    <th className="px-4 py-3">Type</th>
                    <th className="px-4 py-3">From</th>
                    <th className="px-4 py-3">To</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>

                <tbody>
                  {leaves.map((l, i) => (
                    <tr key={i} className="border-b">
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
        </div>

        {/* Salary */}
        <div className="bg-white shadow-lg rounded-xl p-6 mt-8">
          <h2 className="text-lg sm:text-xl font-semibold mb-4 flex items-center gap-2">
            <FaDollarSign className="text-green-600" /> Salary Details
          </h2>

          <div className="overflow-x-auto">
            {salaries.length === 0 ? (
              <p className="text-gray-500 text-center">No salary records yet.</p>
            ) : (
              <table className="w-full text-sm border">
                <thead className="bg-gray-100 text-xs uppercase">
                  <tr>
                    <th className="px-4 py-3">Month</th>
                    <th className="px-4 py-3">Total</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {salaries.map((s, i) => (
                    <tr key={i} className="border-b">
                      <td className="px-4 py-2">{s.month || "-"}</td>
                      <td className="px-4 py-2">
                        ${s.total?.toLocaleString()}
                      </td>
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
        </div>

        {/* Recent Activity */}
        <div className="bg-white shadow-lg rounded-xl p-6 mt-8">
          <h2 className="text-lg sm:text-xl font-semibold mb-4 flex items-center gap-2">
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
                  <div>{a.icon}</div>
                  <div>
                    <p className="font-medium">{a.title}</p>
                    <p className="text-sm text-gray-500">{a.description}</p>
                    <p className="text-xs text-gray-400">
                      {a.time ? format(new Date(a.time), "MMM dd, h:mm a") : "-"}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4">
            <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 max-w-md">
              <h2 className="text-xl font-semibold mb-4">Apply for Leave</h2>

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

              <textarea
                className="w-full p-2 border rounded mb-3"
                rows="3"
                placeholder="Reason for leave"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />

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
  );
}
