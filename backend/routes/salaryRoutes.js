import express from "express";
import {
  updateSalary,
  getMySalary,
  createSalary,
  getAllSalaries,
} from "../controller/salaryController.js";

const router = express.Router();

router.put("/:id", updateSalary);
router.get("/my-salary/:id", getMySalary);
router.post("/", createSalary);
router.get("/", getAllSalaries);

export default router;
