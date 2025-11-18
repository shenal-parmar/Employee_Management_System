// controllers/employeeController.js

import bcrypt from "bcryptjs";
import Employee from "../models/EmployeeModel.js";
import jwt from "jsonwebtoken";

// ===============================
// CREATE / REGISTER EMPLOYEE
// ===============================
export const createEmployee = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      designation,
      salary,
      department,
      emp_id,
      phone,
      address,
      date_of_joining
    } = req.body;

    const existingEmp = await Employee.findOne({ email });
    if (existingEmp)
      return res.status(400).json({ message: "Employee already exists" });

    if (!password)
      return res.status(400).json({ message: "Password is required" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newEmp = await Employee.create({
      name,
      email,
      password: hashedPassword,
      designation,
      salary,
      department,
      phone,
      address,
      date_of_joining
    });

    const { password: _, ...empWithoutPassword } = newEmp.toObject();

    res.status(201).json({ success: true, employee: empWithoutPassword });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ===============================
// READ ALL EMPLOYEES
// ===============================
export const getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find()
      .sort({ createdAt: -1 })
      .select("-password");
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ===============================
// UPDATE EMPLOYEE
// ===============================
export const updateEmployee = async (req, res) => {
  try {
    const { password, ...rest } = req.body;
    let updatedData = { ...rest };

    if (password) updatedData.password = await bcrypt.hash(password, 10);

    const updated = await Employee.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true }
    ).select("-password");

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ===============================
// GET EMPLOYEES WITH DEPARTMENT INFO
// ===============================
export const getEmployeesWithDepartment = async (req, res) => {
  try {
    const employees = await Employee.find()
      .populate("department", "name description")
      .select("-password");

    res.json(employees);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ===============================
// GET LOGGED-IN EMPLOYEE PROFILE
// ===============================
export const getMe = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader)
      return res.status(401).json({ message: "No token" });

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await Employee.findById(decoded.id).select("-password");
    res.json(user);
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

// ===============================
// DELETE EMPLOYEE
// ===============================
export const deleteEmployee = async (req, res) => {
  try {
    await Employee.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
