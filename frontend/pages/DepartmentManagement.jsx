import React, { useState, useEffect } from "react";
import axios from "axios";
const BACKEND_URL = `${import.meta.env.VITE_BACKEND_URL}`

export default function DepartmentManagement() {
  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const [selectedDept, setSelectedDept] = useState(null);
  const [formData, setFormData] = useState({ name: "", description: "" });
  const [loading, setLoading] = useState(true);
const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL?.replace(/\/$/, '')}/api`,
});
  // ✅ Fetch Departments & Employees
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [deptRes, empRes] = await Promise.all([
          api.get(`/departments`),
          api.get("/employees"),
        ]);
        setDepartments(deptRes.data);
        setEmployees(empRes.data);
        // console.log("dep",deptRes.data);
        // console.log("emp",empRes.data);
        
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const fetchDepartments = async () => {
    const res = await api.get("/departments");
    setDepartments(res.data);
  };

  // ✅ Add or Update Department
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedDept) {
        await api.put(
          `/departments/${selectedDept._id}`,
          formData
        );
      } else {
        await api.post("/departments", formData);
      }
      fetchDepartments();
      resetForm();
      setShowDialog(false);
    } catch (err) {
      console.error("Error saving department:", err);
    }
  };

  const handleDelete = async (id) => {
    const employeesInDept = employees.filter((e) => e.department_id === id);
    if (employeesInDept.length > 0) {
      alert(
        `Cannot delete department with ${employeesInDept.length} employees. Please reassign them first.`
      );
      return;
    }

    if (confirm("Are you sure you want to delete this department?")) {
      try {
        await api.delete(`/departments/${id}`);
        fetchDepartments();
      } catch (err) {
        console.error("Error deleting department:", err);
      }
    }
  };

  const handleEdit = (dept) => {
    setSelectedDept(dept);
    setFormData({ name: dept.name, description: dept.description });
    setShowDialog(true);
  };

  const handleAdd = () => {
    resetForm();
    setShowDialog(true);
  };

  const resetForm = () => {
    setFormData({ name: "", description: "" });
    setSelectedDept(null);
  };

  const getDeptEmployeeCount = (deptId) =>
    employees.filter((e) => e.department === deptId).length;

  if (loading)
    return <div className="p-6 text-gray-600 text-center">Loading...</div>;

  return (
    <div className="p-8 max-w-6xl mx-auto font-inter">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-semibold text-gray-800">
            Department Management
          </h1>
          <p className="text-gray-500 text-sm">
            Organize your workforce by departments
          </p>
        </div>
        <button
          onClick={handleAdd}
          className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-5 py-2.5 rounded-lg shadow hover:opacity-90 transition-all duration-200"
        >
          + Add Department
        </button>
      </div>

      {/* Department Cards */}
      {departments.length === 0 ? (
        <div className="text-center text-gray-500 py-10 bg-white shadow rounded-xl border border-gray-200">
          <p>No departments found.</p>
          <button
            onClick={handleAdd}
            className="text-purple-600 underline mt-2 font-medium"
          >
            Create your first department
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {departments.map((dept) => {
            const count = getDeptEmployeeCount(dept._id);
            return (
              <div
                key={dept._id}
                className="bg-white border border-gray-200 shadow-sm rounded-xl p-5 hover:shadow-md transition-all duration-300"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800">
                      {dept.name}
                    </h2>
                    <p className="text-sm text-gray-500">
                      {count} {count === 1 ? "Employee" : "Employees"}
                    </p>
                  </div>
                  <div className="flex gap-2 text-lg">
                    <button
                      onClick={() => handleEdit(dept)}
                      className="text-yellow-500 hover:text-yellow-700"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDelete(dept._id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
                <p className="text-gray-600 text-sm">
                  {dept.description || "No description provided."}
                </p>
              </div>
            );
          })}
        </div>
      )}

      {/* Dialog Modal */}
      {showDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 relative animate-fadeIn">
            <button
              onClick={() => setShowDialog(false)}
              className="absolute top-3 right-4 text-gray-500 hover:text-gray-700 text-xl"
            >
              ✕
            </button>
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              {selectedDept ? "Edit Department" : "Add New Department"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Department Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-purple-500 outline-none"
                  required
                  placeholder="e.g., Engineering, Sales, Marketing"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-purple-500 outline-none"
                  rows="3"
                  placeholder="Brief description of the department..."
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowDialog(false)}
                  className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg text-white bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-90"
                >
                  {selectedDept ? "Update Department" : "Create Department"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

/* Add to your global CSS (index.css or App.css) */
<style>
{`
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fadeIn {
    animation: fadeIn 0.3s ease-out forwards;
  }
`}
</style>
