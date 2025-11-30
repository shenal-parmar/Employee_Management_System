// controllers/leaveController.js

import Leave from "../models/LeaveModel.js";
import { io } from "../server.js";

// CREATE leave request
export const createLeave = async (req, res) => {
  try {
    const {
      emp_id,
      employee_name,
      leave_type,
      from_date,
      to_date,
      days,
      description,
    } = req.body;

    const newLeave = new Leave({
      emp_id,
      employee_name,
      leave_type,
      from_date,
      to_date,
      days,
      description,
    });

    await newLeave.save();
    io.emit("notification", {
      type: "leave_applied",
      message: `${req.body.employee_name} applied for leave`,
    });

    res.status(201).json({
      success: true,
      message: "Leave request created successfully",
      data: newLeave,
    });
  } catch (error) {
    console.error("Error creating leave:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to create leave", error });
  }
};

// GET all leaves
export const getLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find()
      .populate("emp_id")
      .sort({ createdAt: -1 });
    res.status(200).json(leaves);
  } catch (error) {
    console.error("Error fetching leaves:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch leaves", error });
  }
};

// GET single leave
export const getLeaveById = async (req, res) => {
  try {
    const leave = await Leave.findById(req.params.id);
    if (!leave) return res.status(404).json({ message: "Leave not found" });
    res.status(200).json(leave);
  } catch (error) {
    res.status(500).json({ message: "Error fetching leave", error });
  }
};

// GET leaves of an employee
export const getMyLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find({ emp_id: req.params.id }).sort({
      createdAt: -1,
    });
    res.status(200).json(leaves);
  } catch (error) {
    console.error("Error fetching employee leaves:", error);
    res
      .status(500)
      .json({ message: "Error fetching leaves", error: error.message });
  }
};

// UPDATE leave
export const updateLeave = async (req, res) => {
  try {
    const updatedLeave = await Leave.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );

    if (!updatedLeave)
      return res
        .status(404)
        .json({ success: false, message: "Leave not found" });

    res.status(200).json({
      success: true,
      message: "Leave updated successfully",
      data: updatedLeave,
    });
  } catch (error) {
    console.error("Error updating leave:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to update leave", error });
  }
};

// DELETE leave
export const deleteLeave = async (req, res) => {
  try {
    const deleted = await Leave.findByIdAndDelete(req.params.id);

    if (!deleted)
      return res
        .status(404)
        .json({ success: false, message: "Leave not found" });

    res
      .status(200)
      .json({ success: true, message: "Leave deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error deleting leave", error });
  }
};
