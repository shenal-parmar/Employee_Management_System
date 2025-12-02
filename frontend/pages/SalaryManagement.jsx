import React, { useEffect, useState } from "react";
import { getSalaries, getEmployees, createSalary, updateSalary } from "../src/api/salaryApi";
import { FaSearch, FaPlus, FaEdit, FaDollarSign, FaFileAlt } from "react-icons/fa";

export default function SalaryManagement() {
  const [salaries, setSalaries] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);

  const [formData, setFormData] = useState({
    emp_id: "",
    employee_name: "",
    basic_salary: "",
    allowance: "",
    deduction: "",
    total: "",
    month: "",
    year: new Date().getFullYear(),
    status: "Pending",
  });

  useEffect(() => {
    (async () => {
      const sals = await getSalaries();
      const emps = await getEmployees();
      setSalaries(sals);
      setEmployees(emps);
      setLoading(false);
    })();
  }, []);

  const calculateTotal = () => {
    const basic = parseFloat(formData.basic_salary) || 0;
    const allowance = parseFloat(formData.allowance) || 0;
    const deduction = parseFloat(formData.deduction) || 0;
    return basic + allowance - deduction;
  };

  const resetForm = () => {
    setFormData({
      emp_id: "",
      employee_name: "",
      basic_salary: "",
      allowance: "",
      deduction: "",
      total: "",
      month: "",
      year: new Date().getFullYear(),
      status: "Pending",
    });
    setEditing(null);
  };

  const handleEmployeeChange = (id) => {
    const emp = employees.find((e) => e._id === id);
    if (emp) {
      setFormData({
        ...formData,
        emp_id: emp._id,
        employee_name: emp.name,
        basic_salary: emp.salary || "",
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { ...formData, total: calculateTotal() };

    if (editing) await updateSalary(editing._id, data);
    else await createSalary(data);

    const updated = await getSalaries();
    setSalaries(updated);
    setShowForm(false);
    resetForm();
  };

  const filtered = salaries.filter(
    (s) =>
      s.employee_name?.toLowerCase().includes(search.toLowerCase()) ||
      s.month?.toLowerCase().includes(search.toLowerCase())
  );

  const totalPaid = salaries
    .filter((s) => s.status === "Paid")
    .reduce((sum, s) => sum + (s.total || 0), 0);

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 sm:gap-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Salary Management</h1>
          <p className="text-gray-500">Manage employee salaries and payments</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
        >
          <FaPlus /> Generate Salary
        </button>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6">
        <div className="bg-green-50 p-4 rounded-xl shadow flex items-center gap-3">
          <FaDollarSign className="text-green-600 text-2xl" />
          <div>
            <p className="text-gray-500 text-sm">Total Paid</p>
            <h2 className="text-2xl font-bold">${totalPaid.toLocaleString()}</h2>
          </div>
        </div>
        <div className="bg-blue-50 p-4 rounded-xl shadow flex items-center gap-3">
          <FaFileAlt className="text-blue-600 text-2xl" />
          <div>
            <p className="text-gray-500 text-sm">Total Records</p>
            <h2 className="text-2xl font-bold">{salaries.length}</h2>
          </div>
        </div>
        <div className="bg-orange-50 p-4 rounded-xl shadow flex items-center gap-3">
          <FaFileAlt className="text-orange-500 text-2xl" />
          <div>
            <p className="text-gray-500 text-sm">Pending</p>
            <h2 className="text-2xl font-bold">
              {salaries.filter((s) => s.status === "Pending").length}
            </h2>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex items-center bg-white shadow rounded-lg px-4 py-2 mb-4">
        <FaSearch className="text-gray-400 mr-2" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by employee name or month..."
          className="w-full outline-none"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-xl shadow">
        <table className="min-w-full text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-4 text-sm sm:text-base">Employee</th>
              <th className="py-3 px-4 text-sm sm:text-base">Month/Year</th>
              <th className="py-3 px-4 text-sm sm:text-base">Basic</th>
              <th className="py-3 px-4 text-sm sm:text-base">Allowance</th>
              <th className="py-3 px-4 text-sm sm:text-base">Deduction</th>
              <th className="py-3 px-4 text-sm sm:text-base">Net Salary</th>
              <th className="py-3 px-4 text-sm sm:text-base">Status</th>
              <th className="py-3 px-4 text-sm sm:text-base text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td className="p-4 text-gray-500" colSpan={8}>Loading...</td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td className="p-4 text-gray-500" colSpan={8}>No salary records found</td>
              </tr>
            ) : (
              filtered.map((sal) => (
                <tr key={sal._id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">{sal.employee_name}</td>
                  <td className="py-3 px-4">{sal.month} {sal.year}</td>
                  <td className="py-3 px-4">${sal.basic_salary}</td>
                  <td className="py-3 px-4 text-green-700">+${sal.allowance}</td>
                  <td className="py-3 px-4 text-red-700">-${sal.deduction}</td>
                  <td className="py-3 px-4 font-bold">${sal.total}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-1 rounded-lg text-sm ${
                        sal.status === "Paid"
                          ? "bg-green-100 text-green-700"
                          : sal.status === "Processing"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-orange-100 text-orange-700"
                      }`}
                    >
                      {sal.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => {
                        setEditing(sal);
                        setFormData({
                          emp_id: sal.emp_id,
                          employee_name: sal.employee_name,
                          basic_salary: sal.basic_salary,
                          allowance: sal.allowance,
                          deduction: sal.deduction,
                          total: sal.total,
                          month: sal.month,
                          year: sal.year,
                          status: sal.status,
                          _id: sal._id,
                        });
                        setShowForm(true);
                      }}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <FaEdit />
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
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 p-4 sm:p-6">
          <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4">
              {editing ? "Edit Salary Record" : "Generate Salary"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="text-sm font-medium">Select Employee</label>
                <select
                  value={formData.emp_id}
                  onChange={(e) => handleEmployeeChange(e.target.value)}
                  className="w-full border rounded p-2"
                  disabled={!!editing}
                >
                  <option value="">Select employee</option>
                  {employees.map((emp) => (
                    <option key={emp._id} value={emp._id}>
                      {emp.name} 
                    </option>
                  ))}
                </select>
              </div>
              <input
                type="number"
                placeholder="Basic Salary"
                value={formData.basic_salary}
                onChange={(e) => setFormData({ ...formData, basic_salary: e.target.value })}
                className="w-full border rounded p-2"
                required
              />
              <input
                type="number"
                placeholder="Allowance"
                value={formData.allowance}
                onChange={(e) => setFormData({ ...formData, allowance: e.target.value })}
                className="w-full border rounded p-2"
              />
              <input
                type="number"
                placeholder="Deduction"
                value={formData.deduction}
                onChange={(e) => setFormData({ ...formData, deduction: e.target.value })}
                className="w-full border rounded p-2"
              />
              <input
                type="text"
                placeholder="Month"
                value={formData.month}
                onChange={(e) => setFormData({ ...formData, month: e.target.value })}
                className="w-full border rounded p-2"
              />
              <input
                type="number"
                placeholder="Year"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                className="w-full border rounded p-2"
              />
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full border rounded p-2"
              >
                <option value="Pending">Pending</option>
                <option value="Processing">Processing</option>
                <option value="Paid">Paid</option>
              </select>

              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-4 gap-2">
                <h3 className="text-lg font-semibold">
                  Net Salary: ${calculateTotal().toLocaleString()}
                </h3>
                <div className="flex gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-4 py-2 border rounded-lg w-full sm:w-auto"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-600 text-white rounded-lg w-full sm:w-auto"
                  >
                    {editing ? "Update" : "Generate"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
