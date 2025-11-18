import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaSearch, FaPlus } from "react-icons/fa";

export default function LeaveManagement({ userRole = "admin", employeeData }) {
  const [leaves, setLeaves] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [filter, setFilter] = useState("Pending");
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formError, setFormError] = useState("");

  const [formData, setFormData] = useState({
    employee_name: "",
    emp_id: "",
    leave_type: "",
    from_date: "",
    to_date: "",
    days: 0,
    reason: "",
    status: "Pending",
  });

  // Fetch leaves
  const fetchLeaves = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/leaves`);
      // Map or normalize if backend uses nested emp_id etc.
      const mapped = res.data.map((l) => ({
        ...l,
        employee_name: l.employee_name || l.emp_id?.name || l.employee_name || "Unknown",
        emp_id: l.emp_id?._id || l.emp_id || l.emp_id,
        leave_type: l.leave_type || "Not specified",
        reason: l.reason || l.description || "No reason provided",
      }));
      setLeaves(mapped);
    } catch (err) {
      console.error("Error fetching leaves:", err);
    }
  };

  // Fetch employees for admin dropdown and prefill for employee role
  useEffect(() => {
    if (userRole === "admin") {
      axios
        .get(`${import.meta.env.VITE_BACKEND_URL}/employees`)
        .then((res) => setEmployees(res.data))
        .catch((err) => console.error("Error fetching employees:", err));
    } else if (employeeData) {
      // Prefill data for logged-in employee
      setFormData((prev) => ({
        ...prev,
        employee_name: employeeData.name,
        emp_id: employeeData._id,
      }));
    }
  }, [userRole, employeeData?._id]);

  useEffect(() => {
    fetchLeaves();
  }, []);

  // Count leaves by status (handles "All")
  const countByStatus = (status) => {
    if (status === "All") return leaves.length;
    return leaves.filter((l) => l.status === status).length;
  };

  // Auto-calculate number of days
  const calculateDays = (from, to) => {
    if (!from || !to) return 0;
    const start = new Date(from);
    const end = new Date(to);
    const diff = (end - start) / (1000 * 60 * 60 * 24) + 1;
    return diff > 0 ? diff : 0;
  };

  const handleDateChange = (field, value) => {
    const newForm = { ...formData, [field]: value };
    if (newForm.from_date && newForm.to_date) {
      newForm.days = calculateDays(newForm.from_date, newForm.to_date);
    } else {
      newForm.days = 0;
    }
    setFormData(newForm);
  };

  // Validation before submit
  const validateForm = () => {
    const today = new Date();
    // reset time portion for comparison
    today.setHours(0, 0, 0, 0);

    const from = new Date(formData.from_date);
    const to = new Date(formData.to_date);

    if (!formData.emp_id) return "Please select an employee.";
    if (!formData.leave_type) return "Please select leave type.";
    if (!formData.reason || !formData.reason.trim()) return "Reason cannot be empty.";
    if (isNaN(from.getTime()) || isNaN(to.getTime())) return "Please select both dates.";
    if (from < today) return "From date cannot be in the past.";
    if (to < today) return "To date cannot be in the past.";
    if (from > to) return "From date must be before To date.";
    if (formData.days <= 0) return "Invalid date range. Please select valid dates.";
    // Employees shouldn't be able to set status on create
    if (userRole !== "admin" && formData.status && formData.status !== "Pending") {
      return "Employees cannot set leave status.";
    }
    return null;
  };

  const resetForm = () => {
    setFormData({
      employee_name: userRole === "employee" && employeeData ? employeeData.name : "",
      emp_id: userRole === "employee" && employeeData ? employeeData._id : "",
      leave_type: "",
      from_date: "",
      to_date: "",
      days: 0,
      reason: "",
      status: "Pending",
    });
    setEditing(null);
    setFormError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    const errorMsg = validateForm();
    if (errorMsg) {
      setFormError(errorMsg);
      return;
    }

    try {
      const payload = {
        ...formData,
        description: formData.reason,
      };

      if (editing) {
        await axios.put(`${import.meta.env.VITE_BACKEND_URL}/leaves/${editing._id}`, payload);
      } else {
        await axios.post(`${import.meta.env.VITE_BACKEND_URL}/leaves`, payload);
      }

      await fetchLeaves();
      setShowForm(false);
      resetForm();
    } catch (err) {
      console.error("Error saving leave:", err);
      setFormError(err.response?.data?.message || "Failed to save leave. Try again.");
    }
  };

  // Filter & search
  const filteredLeaves = leaves.filter((leave) => {
    const matchesSearch =
      (leave.employee_name || "")
        .toString()
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      (leave.leave_type || "").toLowerCase().includes(search.toLowerCase()) ||
      (leave.emp_id || "").toString().toLowerCase().includes(search.toLowerCase());

    const matchesFilter =
      filter === "All" || (leave.status || "").toLowerCase() === filter.toLowerCase();

    return matchesSearch && matchesFilter;
  });

  // Status change (admin only)
  const handleStatusChange = async (leave, newStatus) => {
    try {
      await axios.put(`${import.meta.env.VITE_BACKEND_URL}/leaves/${leave._id}`, {
        ...leave,
        status: newStatus,
      });
      fetchLeaves();
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Leave Management</h1>
          <p className="text-gray-500">Review and manage employee leave requests</p>
        </div>

        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
        >
          <FaPlus /> Add Leave
        </button>
      </div>

      {/* Cards: Pending / Approved / Rejected / All */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-orange-50 p-4 rounded-xl shadow flex flex-col">
          <p className="text-orange-600 text-sm">Pending Requests</p>
          <h2 className="text-2xl font-bold">{countByStatus("Pending")}</h2>
        </div>

        <div className="bg-green-50 p-4 rounded-xl shadow flex flex-col">
          <p className="text-green-600 text-sm">Approved</p>
          <h2 className="text-2xl font-bold">{countByStatus("Approved")}</h2>
        </div>

        <div className="bg-red-50 p-4 rounded-xl shadow flex flex-col">
          <p className="text-red-600 text-sm">Rejected</p>
          <h2 className="text-2xl font-bold">{countByStatus("Rejected")}</h2>
        </div>

        <div className="bg-blue-50 p-4 rounded-xl shadow flex flex-col">
          <p className="text-blue-600 text-sm">All Requests</p>
          <h2 className="text-2xl font-bold">{countByStatus("All")}</h2>
        </div>
      </div>

      {/* Search */}
      <div className="flex items-center bg-white shadow rounded-lg px-4 py-2 mb-4">
        <FaSearch className="text-gray-400 mr-2" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by employee name, ID, or leave type..."
          className="w-full outline-none"
        />
      </div>

      {/* Tabs */}
      <div className="flex gap-3 mb-4">
        {["Pending", "Approved", "Rejected", "All"].map((status) => (
          <button
            key={status}
            className={`px-4 py-2 rounded-full border ${
              filter === status ? "bg-blue-600 text-white" : "bg-white text-gray-600"
            }`}
            onClick={() => setFilter(status)}
          >
            {status} ({countByStatus(status)})
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-700">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-4">Employee</th>
              <th className="py-3 px-4">Leave Type</th>
              <th className="py-3 px-4">Duration</th>
              <th className="py-3 px-4">Days</th>
              <th className="py-3 px-4">Reason</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredLeaves.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-6 text-gray-500">
                  No {filter.toLowerCase()} leave requests
                </td>
              </tr>
            ) : (
              filteredLeaves.map((leave) => (
                <tr key={leave._id} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-3">{leave.employee_name}</td>
                  <td className="py-2 px-3">{leave.leave_type}</td>
                  <td className="py-2 px-3">
                    {leave.from_date ? new Date(leave.from_date).toLocaleDateString() : "-"} -{" "}
                    {leave.to_date ? new Date(leave.to_date).toLocaleDateString() : "-"}
                  </td>
                  <td className="py-2 px-3">{leave.days}</td>
                  <td className="py-2 px-3">{leave.reason}</td>
                  <td className="py-2 px-3">
                    {userRole === "admin" ? (
                      <select
                        value={leave.status}
                        onChange={(e) => handleStatusChange(leave, e.target.value)}
                        className="border rounded px-2 py-1"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Approved">Approved</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    ) : (
                      leave.status
                    )}
                  </td>
                  <td className="py-2 px-3 text-right">
                    <button
                      onClick={() => {
                        // Pre-fill edit: ensure date fields are in YYYY-MM-DD format if needed
                        setEditing(leave);
                        setFormData((prev) => ({
                          ...prev,
                          employee_name: leave.employee_name || prev.employee_name,
                          emp_id: leave.emp_id || prev.emp_id,
                          leave_type: leave.leave_type || "",
                          from_date: leave.from_date ? leave.from_date.split("T")[0] : "",
                          to_date: leave.to_date ? leave.to_date.split("T")[0] : "",
                          days: leave.days || calculateDays(leave.from_date, leave.to_date),
                          reason: leave.reason || leave.description || "",
                          status: leave.status || "Pending",
                        }));
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

      {/* Modal */}
      
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4">{editing ? "Edit Leave" : "Add Leave"}</h2>

            {formError && (
              <div className="bg-red-100 text-red-700 px-4 py-2 rounded-md mb-2 border border-red-300">
                {formError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3">
              {/* Employee Section */}
              {userRole === "admin" ? (
                <select
                  value={formData.emp_id}
                  onChange={(e) => {
                    const emp = employees.find((x) => x._id === e.target.value);
                    setFormData({
                      ...formData,
                      emp_id: emp?._id,
                      employee_name: emp?.name || "",
                    });
                  }}
                  className="w-full border rounded p-2"
                  required
                >
                  <option value="">Select Employee</option>
                  {employees.map((emp) => (
                    <option key={emp._id} value={emp._id}>
                      {emp.name} ({emp.emp_id})
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  value={formData.employee_name}
                  readOnly
                  className="w-full border rounded p-2 bg-gray-100"
                />
              )}

              {/* Emp ID (read-only) */}
              <input
                type="text"
                value={formData.emp_id}
                readOnly
                className="w-full border rounded p-2 bg-gray-100"
                placeholder="Employee ID"
              />

              {/* Leave Type */}
              <select
                value={formData.leave_type}
                onChange={(e) => setFormData({ ...formData, leave_type: e.target.value })}
                className="w-full border rounded p-2"
                required
              >
                <option value="">Select Leave Type</option>
                <option value="Sick Leave">Sick Leave</option>
                <option value="Casual Leave">Casual Leave</option>
                <option value="Earned Leave">Earned Leave</option>
                <option value="Maternity Leave">Maternity Leave</option>
                <option value="Paternity Leave">Paternity Leave</option>
              </select>

              {/* Dates */}
              <div className="flex gap-2">
                <input
                  type="date"
                  value={formData.from_date}
                  onChange={(e) => handleDateChange("from_date", e.target.value)}
                  className="w-full border rounded p-2"
                  required
                />
                <input
                  type="date"
                  value={formData.to_date}
                  onChange={(e) => handleDateChange("to_date", e.target.value)}
                  className="w-full border rounded p-2"
                  required
                />
              </div>

              {/* Days */}
              <input
                type="number"
                value={formData.days}
                readOnly
                className="w-full border rounded p-2 bg-gray-100"
                placeholder="Number of days auto-calculated"
              />

              {/* Reason */}
              <textarea
                placeholder="Reason"
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                className="w-full border rounded p-2"
                required
              />

              {/* Status (admin only) */}
              {userRole === "admin" && (
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full border rounded p-2"
                >
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                </select>
              )}

              <div className="flex justify-end gap-2 mt-4">
                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 border rounded-lg">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-lg">
                  {editing ? "Update" : "Add Leave"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
