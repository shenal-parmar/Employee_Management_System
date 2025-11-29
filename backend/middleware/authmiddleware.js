import Employee from "../models/EmployeeModel.js";
import User from "../models/UserModel.js";
import jwt from "jsonwebtoken"
export const protect = async (req, res, next) => {
  let token;
  // console.log("VERIFY JWT SECRET:", process.env.JWT_SECRET);

  // console.log("request : ",req.headers.authorization.startsWith('Bearer'));
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(" ")[1];
      // console.log("auth middleware secret:",process.env.JWT_SECRET);
      // console.log("aoken:",req.headers.authorization);
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      // console.log("decoded by auth middleware: ",decoded);
      
      req.user = await User.findById(decoded.id).select('-password');
      if(!req.user){
        req.user = await Employee.findById(decoded.id).select('-password');
      }
      next();
    } catch (error) {
      res.status(401).json({ message: 'Not authorized,here token failed' ,token:token});
    }
  } else {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};
export const adminOnly = (req, res, next) => {
  if (!req.user || !req.userRole=="admin") {
    return res.status(403).json({ message: "Admin access only" });
  }
  next();
};
