// controllers/employeeController.js

import bcrypt from "bcryptjs";
import Employee from "../models/EmployeeModel.js";
import jwt from "jsonwebtoken";
import User from "../models/UserModel.js";

// ===============================
// CREATE / REGISTER EMPLOYEE
// ===============================
export const createEmployee = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      address,
      salary,
      gender,
      marital_status,
      date_of_joining
    } = req.body;

    // Check if employee already exists
    const existingEmp = await Employee.findOne({ email });
    if (existingEmp)
      return res.status(400).json({ message: "Employee already exists" });

    if (!password)
      return res.status(400).json({ message: "Password is required" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create employee WITHOUT designation + department
    const newEmp = await Employee.create({
      name,
      email,
      password: hashedPassword,
      phone,
      address,
      salary,
      gender,
      marital_status,
      date_of_joining,

      // Admin will assign later
      designation: null,
      department: null,
      status: "pending"
    });

    // Remove password from response
    const { password: _, ...empWithoutPassword } = newEmp.toObject();

    res.status(201).json({
      success: true,
      message: "Registration successful. Waiting for admin approval.",
      employee: empWithoutPassword
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const toggleStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    // Toggle logic
    user.status = user.status === "pending" ? "approved" : "pending";

    await user.save();

    res.json({
      message: "Status updated successfully",
      status: user.status,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getpendingEmps = async (req, res) => {
  const users = await Employee.find({ status: "pending" });
  res.json(users);
}

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
// UPDATE EMPLOYEE (Admin assigns department + designation)
// ===============================
export const updateEmployee = async (req, res) => {
  try {
    const { password, ...rest } = req.body;

    let updatedData = { ...rest };

    // If admin updates password
    if (password)
      updatedData.password = await bcrypt.hash(password, 10);

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
// EMPLOYEES + POPULATED DEPARTMENT
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
