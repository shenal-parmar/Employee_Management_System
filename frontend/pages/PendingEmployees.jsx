import React, { use, useEffect, useState } from "react";
import api from "../src/api/api.js";
import toast from "react-hot-toast";
import { socket } from "../socket.js";


export default function PendingEmployees() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPending = async () => {
      try {
        const res = await api.get("/employees/pending");
        setEmployees(res.data);
      } catch (err) {
        console.error("Error fetching pending employees:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPending();
  }, []);
 useEffect(() => {
  socket.on("approved", (data) => {
    toast.success(data.message);
  });

  return () => socket.off("approved");
}, []);
  const handleApprove = async (id) => {
  try {
    await api.put(`/employees/approve/${id}`);
    
    toast.success("Employee approved successfully!");
    setEmployees((prev) => prev.filter((e) => e._id !== id));
  } catch (err) {
    console.error("Error approving employee:", err);
  }
};


  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4">Pending Employee Approvals</h1>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : employees.length === 0 ? (
        <p className="text-gray-500">No pending employees</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded-xl shadow">
          <table className="min-w-full text-left border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-2 sm:px-4">Name</th>
                <th className="py-3 px-2 sm:px-4">Email</th>
                <th className="py-3 px-2 sm:px-4">Phone</th>
                <th className="py-3 px-2 sm:px-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp) => (
                <tr key={emp._id} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-2 sm:px-4">{emp.name}</td>
                  <td className="py-2 px-2 sm:px-4">{emp.email}</td>
                  <td className="py-2 px-2 sm:px-4">{emp.phone}</td>
                  <td className="py-2 px-2 sm:px-4">
                    <button
                      className="text-green-600 font-semibold hover:underline"
                      onClick={() => handleApprove(emp._id)}
                    >
                      Approve
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
