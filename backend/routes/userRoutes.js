import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/UserModel.js";
import Employee from "../models/EmployeeModel.js";

// const navigate = useNavigate()

const router = express.Router();


router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "admin",
    });

    res.status(201).json({ message: "User created successfully", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// 🔑 Login user
//if user found in user or employe then match paswword and assign token 
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // First try to find user in "User" collection
    let user = await User.findOne({ email });
    // If not found in User, check Employee collection
    let role = "admin"; // default role for User collection
    if (!user) {
      user = await Employee.findOne({ email });
      // console.log("in emp check", user);
      role = "employee"; // assign role dynamically
    }

    if (!user) {
      return res
        .status(400)
        .json({ message: "User not found in any collection" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });
    // Generate JWT token
    console.log("LOGIN JWT SECRET:", process.env.JWT_SECRET);

    const token = jwt.sign(
      { id: user._id, email: user.email, role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Return user info based on collection
    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      role:user.role,
      user: {
        name: user.name || user.full_name,
        email: user.email,
        id : user._id ,
        role,
        ...(role === "employee"
          ? { emp_id: user.emp_id, department: user.department }
          : {}),
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 👤 Get logged-in user
router.get("/me", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: "No token" });

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    let user = await User.findById(decoded.id).select("-password");
    if(!user){
       user = await Employee.findById(decoded.id).select("-password");

    }

    res.json(user);
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
});

export default router;
