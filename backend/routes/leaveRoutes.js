import express from "express";
import {
  createLeave,
  getLeaves,
  getLeaveById,
  getMyLeaves,
  updateLeave,
  deleteLeave,
  updateLeaveStatus,
} from "../controller/leaveController.js";

const router = express.Router();

router.post("/", createLeave);
router.get("/", getLeaves);
router.get("/:id", getLeaveById);
router.get("/my-leaves/:id", getMyLeaves);
router.put("/:id", updateLeaveStatus);
router.patch("/:id", updateLeave);
router.delete("/:id", deleteLeave);

export default router;
