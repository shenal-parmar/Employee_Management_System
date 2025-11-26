// routes/authRoutes.js
import express from "express";
import {verifyUser} from "../middleware/verifyUser.js";

const router = express.Router();

router.get("/verify", verifyUser, (req, res) => {
  res.json({
    success: true,
    user: req.user, 
    role:req.user.role,// this is the user decoded from the token
  });
});


export default router;
