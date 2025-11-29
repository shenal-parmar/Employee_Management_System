import express from "express";
const router = express.Router();
import { adminOnly, protect } from "../middleware/authmiddleware.js";

import {
  createEmployee,
  getEmployees,
  updateEmployee,
  getEmployeesWithDepartment,
  getMe,
  deleteEmployee,
  getpendingEmps,
  toggleStatus,
  uploadFile
} from "../controller/employeeController.js";
import upload from "../middleware/upload.js";


// CREATE
router.post("/",  upload.single("profile_image"),createEmployee);

router.put("/:id/upload", uploadFile);

// READ ALL
// GET /employees/pending
router.get("/pending", protect, adminOnly, getpendingEmps);

router.get("/", getEmployees);

// UPDATE
router.put("/:id", updateEmployee);

// GET EMPLOYEE + DEPARTMENT INFO
router.get("/empdep", getEmployeesWithDepartment);
router.put("/status/:id", protect, adminOnly, toggleStatus);


// GET LOGGED-IN EMPLOYEE INFO
router.get("/me", getMe);

// DELETE
router.delete("/:id", deleteEmployee);

export default router;
