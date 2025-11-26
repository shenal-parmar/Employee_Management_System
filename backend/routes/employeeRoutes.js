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
  toggleStatus
} from "../controller/employeeController.js";


// CREATE
router.post("/", createEmployee);

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
