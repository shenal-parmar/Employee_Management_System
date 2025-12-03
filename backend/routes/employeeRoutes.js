import express from "express";
import { adminOnly, protect } from "../middleware/authmiddleware.js";
const router = express.Router();

import {
  createEmployee,
  getEmployees,
  updateEmployee,
  getEmployeesWithDepartment,
  getMe,
  deleteEmployee,
  getpendingEmps,
  toggleStatus,
  uploadFile,
  approveEmp
} from "../controller/employeeController.js";
import upload from "../middleware/upload.js";
// Proper test stub for multer
function safeUpload() {
  if (process.env.NODE_ENV === "test") {
    // Must be a proper middleware function
    return (req, res, next) => {
      req.file = undefined; // multer normally sets this
      return next();
    };
  }
  return upload.single("profile_image");
}


// CREATE
router.post("/",safeUpload(),createEmployee);

router.put("/:id/upload",safeUpload(), uploadFile);
router.put("/approve/:id",approveEmp)

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