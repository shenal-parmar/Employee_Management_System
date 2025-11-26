import React, { useEffect, useState } from "react";
import { FaSearch, FaPlus, FaUserAlt } from "react-icons/fa";
import api from "../src/api/api.js";
export default function EmployeeManagement() {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    designation: "",
    salary: "",
    date_of_joining: "",
    department: "",
  });

  // 🧩 Fetch departments
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await api.get(`/departments`);
        setDepartments(res.data);
      } catch (err) {
        console.error("Error fetching departments:", err);
      }
    };
    fetchDepartments();
  }, []);

  // 🧩 Fetch employees
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await api.get(`/employees`);
        setEmployees(res.data);
      } catch (err) {
        console.error("Error fetching employees:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchEmployees();
  }, []);

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      password: "",
      designation: "",
      salary: "",
      date_of_joining: "",
      department: "",
    });
    setEditing(null);
  };

  // 🧩 Add or Update employee
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await api.put(`/employees/${editing._id}`, formData);
      } else {
        await api.post(`/employees`, formData);
      }

      const res = await api.get(`/employees`);
      setEmployees(res.data);
      setShowForm(false);
      resetForm();
    } catch (err) {
      console.error("Error saving employee:", err);
    }
  };

  // 🧮 Search Filter
  const filtered = employees.filter(
    (e) =>
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      (departments.find((d) => d._id === e.department)?.name || "")
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      e.designation?.toLowerCase().includes(search.toLowerCase())
  );
  const handleStatusToggle = async (emp) => {
  try {
    const newStatus = emp.status === "pending" ? "verified" : "pending";

    await api.put(`/employees/status/${emp._id}`, { status: newStatus });

    // Update state immediately
    setEmployees((prev) =>
      prev.map((e) => (e._id === emp._id ? { ...e, status: newStatus } : e))
    );
  } catch (err) {
    console.error("Error updating employee status:", err);
  }
};


  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header + Add Employee */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Employee Management
          </h1>
          <p className="text-gray-500">Manage employee details and records</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
        >
          <FaPlus /> Add Employee
        </button>
      </div>

      {/* Overview Cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-6">
        <div className="bg-blue-50 p-4 rounded-xl shadow flex items-center gap-3">
          <FaUserAlt className="text-blue-600 text-2xl" />
          <div>
            <p className="text-gray-500 text-sm">Total Employees</p>
            <h2 className="text-2xl font-bold">{employees.length}</h2>
          </div>
        </div>
        <div className="bg-green-50 p-4 rounded-xl shadow flex items-center gap-3">
          <FaUserAlt className="text-green-600 text-2xl" />
          <div>
            <p className="text-gray-500 text-sm">Departments</p>
            <h2 className="text-2xl font-bold">
              {new Set(employees.map((e) => e.department)).size}
            </h2>
          </div>
        </div>
        <div className="bg-yellow-50 p-4 rounded-xl shadow flex items-center gap-3">
          <FaUserAlt className="text-yellow-600 text-2xl" />
          <div>
            <p className="text-gray-500 text-sm">Designations</p>
            <h2 className="text-2xl font-bold">
              {new Set(employees.map((e) => e.designation)).size}
            </h2>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="flex items-center bg-white shadow rounded-lg px-4 py-2 mb-4">
        <FaSearch className="text-gray-400 mr-2" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, department, or designation..."
          className="w-full outline-none"
        />
      </div>

      {/* Employee Table */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">Email</th>
              <th className="py-3 px-4">Department</th>
              <th className="py-3 px-4">Designation</th>
              <th className="py-3 px-4">Salary</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td className="p-4 text-gray-500" colSpan={6}>
                  Loading...
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td className="p-4 text-gray-500" colSpan={6}>
                  No employees found
                </td>
              </tr>
            ) : (
              filtered.map((emp) => (
                <tr key={emp._id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">{emp.name}</td>
                  <td className="py-3 px-4">{emp.email}</td>
                  <td className="py-3 px-4">
                    {departments.find((d) => d._id === emp.department)?.name ||
                      "N/A"}
                  </td>
                  <td className="py-3 px-4">{emp.designation}</td>
                  <td className="py-3 px-4">${emp.salary}</td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => handleStatusToggle(emp)}
                      className={`w-8 h-4 flex items-center rounded-full transition-colors duration-200
      ${emp.status === "verified" ? "bg-green-500" : "bg-red-500"}`}
                    >
                      <div
                        className={`w-3 h-3 bg-white rounded-full shadow transform transition-transform duration-200
        ${emp.status === "verified" ? "translate-x-4" : "translate-x-0"}`}
                      ></div>
                    </button>
                  </td>

                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => {
                        setEditing(emp);
                        setFormData({
                          ...emp,
                          date_of_joining: emp.date_of_joining
                            ? emp.date_of_joining.split("T")[0]
                            : "",
                        });
                        setShowForm(true);
                      }}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4">
              {editing ? "Edit Employee" : "Add Employee"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="text"
                placeholder="Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full border rounded p-2"
                required
              />

              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full border rounded p-2"
                required
              />

              {!editing && (
                <input
                  type="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="w-full border rounded p-2"
                  required
                />
              )}

              <select
                value={formData.department || ""}
                onChange={(e) =>
                  setFormData({ ...formData, department: e.target.value })
                }
                className="w-full border rounded p-2"
                required
              >
                <option value="">Select Department</option>
                {departments.map((d) => (
                  <option key={d._id} value={d._id}>
                    {d.name}
                  </option>
                ))}
              </select>

              <select
                value={formData.designation || ""}
                onChange={(e) =>
                  setFormData({ ...formData, designation: e.target.value })
                }
                className="w-full border rounded p-2"
                required
              >
                <option value="">Select Designation</option>
                <option value="Software Engineer">Software Engineer</option>
                <option value="Team Lead">Team Lead</option>
                <option value="Manager">Manager</option>
                <option value="HR">HR</option>
                <option value="Intern">Intern</option>
              </select>

              <input
                type="number"
                placeholder="Salary"
                value={formData.salary}
                onChange={(e) =>
                  setFormData({ ...formData, salary: e.target.value })
                }
                className="w-full border rounded p-2"
              />

              <input
                type="date"
                value={formData.date_of_joining || ""}
                onChange={(e) =>
                  setFormData({ ...formData, date_of_joining: e.target.value })
                }
                className="w-full border rounded p-2"
                required
              />

              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 border rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-lg"
                >
                  {editing ? "Update" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
