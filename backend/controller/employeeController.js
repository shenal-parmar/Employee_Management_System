// controllers/employeeController.js

import bcrypt from "bcryptjs";
import Employee from "../models/EmployeeModel.js";
import jwt from "jsonwebtoken";
import upload from "../middleware/upload.js";
import { sendMail } from "../utils/MailService.js";

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
      date_of_joining,
    } = req.body;

    // Check if employee already exists
    const existingEmp = await Employee.findOne({ email });
    if (existingEmp)
      return res.status(400).json({ message: "Employee already exists" });

    if (!password)
      return res.status(400).json({ message: "Password is required" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(req.file);

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
      status: "pending",
      profile_image: req.file ? `/uploads/${req.file.filename}` : null,
    });

    // Remove password from response
    const { password: _, ...empWithoutPassword } = newEmp.toObject();
    await sendMail({
      to: process.env.BREVO_SENDER,
      subject: "New Employee Registered",
      text: `A new employee (${newEmp.name}) has registered. Please review and approve.`,
    });
    res.status(201).json({
      success: true,
      message: "Registration successful. Waiting for admin approval.",
      employee: empWithoutPassword,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const approveEmp =  async (req, res) => {
  const employee = await Employee.findByIdAndUpdate(
    req.params.id,
    { status: "approved" },
    { new: true }
  );
  alert("please assign department and salary to the employee")
  req.io.to(employee._id.toString()).emit("approved", {
      message: "Your account has been approved!",
    });
  // Send email to EMPLOYEE
  await sendMail({
    to: employee.email,
    subject: "Registration Approved",
    text: `Hello ${employee.name},\n\nYour employee account has been approved by the admin.`,
  });

  res.json({ message: "Employee approved" });
}


export const toggleStatus = async (req, res) => {
  try {
    // console.log("user id in toggle: ",req.params.id);

    const user = await Employee.findById(req.params.id);

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
  const users1 = await Employee.find();
  res.json(users);
};
export const uploadFile = async (req, res) => {
   if (!req.file) return res.status(400).json({ message: "No file uploaded" });

  
      try {
        const emp = await Employee.findByIdAndUpdate(
          req.params.id,
       { profile_image: `/uploads/${req.file.filename}` },
          { new: true }
        );
        res.json(emp);
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
// UPDATE EMPLOYEE (Admin assigns department + designation)
// ===============================
export const updateEmployee = async (req, res) => {
  try {
    const { password, ...rest } = req.body;

    let updatedData = { ...rest };

    // If admin updates password
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
    if (!authHeader) return res.status(401).json({ message: "No token" });

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