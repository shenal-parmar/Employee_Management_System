import express from "express";
import {
  createEmployee,
  getEmployees,
  updateEmployee,
  getEmployeesWithDepartment,
  getMe,
  deleteEmployee
} from "../controller/employeeController.js";

const router = express.Router();

// CREATE
router.post("/", createEmployee);

// READ ALL
router.get("/", getEmployees);

// UPDATE
router.put("/:id", updateEmployee);

// GET EMPLOYEE + DEPARTMENT INFO
router.get("/empdep", getEmployeesWithDepartment);

// GET LOGGED-IN EMPLOYEE INFO
router.get("/me", getMe);

// DELETE
router.delete("/:id", deleteEmployee);

export default router;
