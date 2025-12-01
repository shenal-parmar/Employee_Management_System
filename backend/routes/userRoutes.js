import express from "express";
import {
  registerUser,
  loginUser,
  getCurrentUser,
} from "../controller/userController.js";

const router = express.Router();

// Register
router.post("/register", registerUser);

// Login
router.post("/login", loginUser);

// Get logged-in user
router.get("/me", getCurrentUser);

export default router;
