import express from "express";
import {
  getDepartments,
  addDepartment,
  updateDepartment,
  deleteDepartment,
} from "../controller/departmentController.js";

const router = express.Router();

// Get all departments
router.get("/", getDepartments);

// Add department
router.post("/", addDepartment);

// Update department
router.put("/:id", updateDepartment);

// Delete department
router.delete("/:id", deleteDepartment);

export default router;
