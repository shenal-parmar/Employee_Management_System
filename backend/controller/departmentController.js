// controllers/departmentController.js

import Department from "../models/DepartmentModel.js";

// ===============================
// 📌 Get All Departments
// ===============================
export const getDepartments = async (req, res) => {
  try {
    const departments = await Department.find();
    res.json(departments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ===============================
// ➕ Add Department
// ===============================
export const addDepartment = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Department name is required" });
    }

    const exists = await Department.findOne({ name });
    if (exists) {
      return res.status(409).json({ message: "Department already exists" });
    }

    const department = await Department.create({
      name,
      description,
    });

    res.status(201).json({
      message: "Department added successfully",
      department,
    });
  } catch (error) {
    console.error("Error adding department:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ===============================
// ✏️ Update Department
// ===============================
export const updateDepartment = async (req, res) => {
  try {
    const { name, description } = req.body;

    const updated = await Department.findByIdAndUpdate(
      req.params.id,
      { name, description },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Department not found" });
    }

    res.status(200).json({
      message: "Department updated successfully",
      department: updated,
    });
  } catch (error) {
    console.error("Error updating department:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ===============================
// ❌ Delete Department
// ===============================
export const deleteDepartment = async (req, res) => {
  try {
    const deleted = await Department.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Department not found" });
    }

    res.status(200).json({ message: "Department deleted successfully" });
  } catch (error) {
    console.error("Error deleting department:", error);
    res.status(500).json({ message: "Server error" });
  }
};
