import React, { useEffect, useState } from "react";
import { FaUsers, FaBuilding, FaCalendarAlt, FaMoneyBillWave, FaDownload, FaChartLine } from "react-icons/fa";
import api from "../src/api/api.js";
export default function Reports() {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [salaries, setSalaries] = useState([]);
  const [loading, setLoading] = useState(true);

  const API = `${import.meta.env.VITE_BACKEND_URL}`; // Change this if your backend runs elsewhere

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [empRes, depRes, leaveRes, salRes] = await Promise.all([
          api.get(`/employees`),
          api.get(`/departments`),
          api.get(`/leaves`),
          api.get(`/salaries`)
        ]);
        setEmployees(empRes.data);
        setDepartments(depRes.data);
        setLeaves(leaveRes.data);
        setSalaries(salRes.data);
      } catch (error) {
        console.error("Error loading reports:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // CSV download helper
  const downloadCSV = (content, filename) => {
    const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Employee Report
  const downloadEmployeeReport = () => {
    const csv = [
      ["Employee ID", "Name", "Email", "Designation", "Department", "Salary"].join(","),
      ...employees.map(emp =>
        [emp.emp_id, emp.name, emp.email, emp.designation, emp.department || "N/A", emp.salary || 0].join(",")
      )
    ].join("\n");
    downloadCSV(csv, "employee_report.csv");
  };

  // Leave Report
  const downloadLeaveReport = () => {
    const csv = [
      ["Employee ID", "Name", "Type", "From", "To", "Days", "Status"].join(","),
      ...leaves.map(leave =>
        [leave.emp_id, leave.employee_name, leave.leave_type, leave.from_date, leave.to_date, leave.days, leave.status].join(",")
      )
    ].join("\n");
    downloadCSV(csv, "leave_report.csv");
  };

  // Salary Report
  const downloadSalaryReport = () => {
    const csv = [
      ["Employee ID", "Name", "Month", "Basic", "Allowance", "Deductions", "Net"].join(","),
      ...salaries.map(s =>
        [s.emp_id, s.employee_name, s.month, s.basic, s.allowance || 0, s.deductions || 0, s.netSalary || 0].join(",")
      )
    ].join("\n");
    downloadCSV(csv, "salary_report.csv");
  };

  if (loading)
    return <div className="p-10 text-center text-gray-600 text-lg">Loading Reports...</div>;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Reports & Analytics</h1>
      <p className="mb-8 text-gray-500">Download detailed reports in CSV format</p>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        {[
          { icon: <FaUsers />, label: "Total Employees", value: employees.length, color: "text-blue-600" },
          { icon: <FaBuilding />, label: "Departments", value: departments.length, color: "text-purple-600" },
          { icon: <FaCalendarAlt />, label: "Total Leaves", value: leaves.length, color: "text-orange-600" },
          { icon: <FaMoneyBillWave />, label: "Salary Records", value: salaries.length, color: "text-green-600" }
        ].map((item, i) => (
          <div key={i} className="bg-white shadow-md rounded-xl p-6 text-center">
            <div className={`text-3xl mb-3 ${item.color}`}>{item.icon}</div>
            <p className="text-2xl font-semibold text-gray-800">{item.value}</p>
            <p className="text-gray-500 text-sm">{item.label}</p>
          </div>
        ))}
      </div>

      {/* Reports Section */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white shadow-lg rounded-xl p-6 border-t-4 border-blue-500">
          <div className="flex items-center gap-3 mb-3 text-blue-600 text-lg font-semibold">
            <FaUsers /> Employee Report
          </div>
          <p className="text-gray-600 mb-4">List of all employees with department and salary info.</p>
          <button
            onClick={downloadEmployeeReport}
            className="flex items-center justify-center gap-2 w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            <FaDownload /> Download CSV
          </button>
        </div>

        <div className="bg-white shadow-lg rounded-xl p-6 border-t-4 border-purple-500">
          <div className="flex items-center gap-3 mb-3 text-purple-600 text-lg font-semibold">
            <FaCalendarAlt /> Leave Report
          </div>
          <p className="text-gray-600 mb-4">Records of all employee leave applications.</p>
          <button
            onClick={downloadLeaveReport}
            className="flex items-center justify-center gap-2 w-full py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition"
          >
            <FaDownload /> Download CSV
          </button>
        </div>

        <div className="bg-white shadow-lg rounded-xl p-6 border-t-4 border-green-500">
          <div className="flex items-center gap-3 mb-3 text-green-600 text-lg font-semibold">
            <FaMoneyBillWave /> Salary Report
          </div>
          <p className="text-gray-600 mb-4">Salary payments and calculations for employees.</p>
          <button
            onClick={downloadSalaryReport}
            className="flex items-center justify-center gap-2 w-full py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
          >
            <FaDownload /> Download CSV
          </button>
        </div>
      </div>

      {/* Quick Insights */}
      <div className="bg-white shadow-lg rounded-xl mt-8 p-6">
        <div className="flex items-center gap-3 mb-4 text-gray-800 text-lg font-semibold">
          <FaChartLine className="text-blue-600" /> Quick Insights
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-600">Average Salary</p>
            <p className="text-2xl font-bold text-blue-600">
              ₹{employees.length ? (employees.reduce((sum, e) => sum + (e.salary || 0), 0) / employees.length).toFixed(0) : 0}
            </p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <p className="text-sm text-gray-600">Total Salary Paid</p>
            <p className="text-2xl font-bold text-green-600">
             { console.log(salaries)}
              
              ₹{salaries.reduce((sum, s) => sum + (s.basic_salary || 0), 0).toLocaleString()}
            </p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg">
            <p className="text-sm text-gray-600">Pending Leaves</p>
            <p className="text-2xl font-bold text-purple-600">
              {leaves.filter(l => l.status === "Pending").length}
            </p>
          </div>
          <div className="p-4 bg-orange-50 rounded-lg">
            <p className="text-sm text-gray-600">Approved Leaves</p>
            <p className="text-2xl font-bold text-orange-600">
              {leaves.filter(l => l.status === "Approved").length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
