
import React, { useEffect, useState } from "react";
import api from "../src/api/api.js";

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

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Pending Employee Approvals</h1>

      {loading ? (
        <p>Loading...</p>
      ) : employees.length === 0 ? (
        <p className="text-gray-500">No pending employees</p>
      ) : (
        <div className="bg-white rounded-xl shadow overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Phone</th>
                <th className="py-3 px-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp) => (
                <tr key={emp._id} className="border-b">
                  <td className="py-3 px-4">{emp.name}</td>
                  <td className="py-3 px-4">{emp.email}</td>
                  <td className="py-3 px-4">{emp.phone}</td>
                  <td className="py-3 px-4">
                    <button
                      className="text-green-600 font-semibold"
                      onClick={() => alert("Approve logic coming…")}
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
