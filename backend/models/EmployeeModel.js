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

    // Admin will assign later → NOT required now
    designation: {
      type: String,
      trim: true,
      default: null,
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

    // Admin will assign later → NOT required now
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      default: null,
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

    // NEW FIELD to track registration approval
    status: {
      type: String,
      enum: ["pending", "approved"],
      default: "pending",
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Employee = mongoose.model("Employee", EmployeeSchema);
export default Employee;
