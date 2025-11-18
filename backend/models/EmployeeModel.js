import mongoose from "mongoose";

const EmployeeSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      description: "Reference to User entity ID",
    },
    name: {
      type: String,
      required: true,
      trim: true,
      description: "Employee name",
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
      description: "Employee email",
    },
    password: {
      type: String,
      required: true,
      description: "Employee password (hashed or plain text)",
    },
    date_of_joining: {
      type: Date,
      required: true,
      description: "Date of joining",
    },
    designation: {
      type: String,
      required: true,
      trim: true,
    },
    salary: {
      type: Number,
      default: 0,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
    },
    marital_status: {
      type: String,
      enum: ["Single", "Married", "Divorced", "Widowed"],
    },
    department_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: true,
    },
    phone: {
      type: String,
    },
    address: {
      type: String,
    },
    profile_image: {
      type: String,
    },
  },
  { timestamps: true }
);

const Employee = mongoose.model("Employee", EmployeeSchema);
export default Employee;
