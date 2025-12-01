import User from "../models/UserModel.js" 
import Employee from "../models/EmployeeModel.js" 
import jwt from "jsonwebtoken"
export const verifyUser = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ success: false, message: "No token provided" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    let user = await User.findById(decoded.id);
    if (!user) {
      user = await Employee.findById(decoded.id);
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
    }
    req.user = user;
    next();
  } catch (error) {
    console.error("Verify error:", error);
    res.status(403).json({ success: false, message: "Invalid token" });
  }
};
