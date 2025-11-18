// controllers/salaryController.js

import Salary from "../models/SalaryModel.js";
import Employee from "../models/EmployeeModel.js";
import mongoose from "mongoose";

// UPDATE salary
export const updateSalary = async (req, res) => {
  try {
    const updated = await Salary.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updated) {
      return res
        .status(404)
        .json({ success: false, message: "Salary not found" });
    }

    res.json({ success: true, message: "Salary updated", salary: updated });
  } catch (err) {
    console.error("Error updating salary:", err);
    res.status(500).json({ success: false, message: "Error updating salary", error: err });
  }
};

// GET employee salary
export const getMySalary = async (req, res) => {
  try {
    const id = req.params.id;

    const salaries = await Salary.find({
      emp_id: new mongoose.Types.ObjectId(id),
    }).sort({ createdAt: -1 });

    res.json(salaries);
  } catch (err) {
    console.error("Error fetching employee salary:", err);
    res.status(500).json({ error: err.message });
  }
};

// CREATE salary record
export const createSalary = async (req, res) => {
  try {
    const { emp_id, basic_salary, allowance, deduction, total, month, year, status } = req.body;

    if (!emp_id) return res.status(400).json({ error: "emp_id is required" });

    const emp = await Employee.findById(emp_id);
    if (!emp) return res.status(404).json({ error: "Employee not found" });

    const salary = new Salary({
      emp_id,
      employee_name: emp.name,
      basic_salary,
      allowance,
      deduction,
      total,
      month,
      year,
      status: status || "Pending",
    });

    await salary.save();
    res.status(201).json(salary);
  } catch (err) {
    console.error("Create salary error:", err);
    res.status(500).json({ error: err.message });
  }
};

// GET all salaries
export const getAllSalaries = async (req, res) => {
  try {
    const all = await Salary.find();
    res.json(all);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
