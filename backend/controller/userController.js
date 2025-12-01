import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/UserModel.js";
import Employee from "../models/EmployeeModel.js";

// 📌 Register User
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

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
};

// 📌 Login User (checks both User & Employee collections)
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    let user = await User.findOne({ email });
    let role = "admin";

    if (!user) {
      user = await Employee.findOne({ email });
      role = "employee";
    }

    if (!user) {
      return res
        .status(400)
        .json({ message: "User not found in any collection" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, email: user.email, role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      role: user.role,
      user: {
        name: user.name || user.full_name,
        email: user.email,
        id: user._id,
        role,
        ...(role === "employee"
          ? { emp_id: user.emp_id, department: user.department }
          : {}),
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 📌 Get Logged-in User Details
export const getCurrentUser = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader)
      return res.status(401).json({ message: "No token provided" });

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    let user = await User.findById(decoded.id).select("-password");
    if (!user) {
      user = await Employee.findById(decoded.id).select("-password");
    }

    res.json(user);
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};
