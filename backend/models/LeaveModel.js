import mongoose from "mongoose";
//test@123
const LeaveSchema = new mongoose.Schema(
  {
    emp_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    employee_name: {
      type: String,
      required: true,
    },
    leave_type: {
      type: String,
      enum: [
        "Sick Leave",
        "Casual Leave",
        "Paid Leave",
        "Unpaid Leave",
        "Maternity Leave",
        "Paternity Leave",
      ],
      required: true,
    },
    from_date: {
      type: Date,
      required: true,
    },
    to_date: {
      type: Date,
      required: true,
    },
    days: {
      type: Number,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
    reason: {
      type: String,
    },
    approved_by: {
      type: String,
    },
  },
  { timestamps: true }
);

const Leave = mongoose.model("Leave", LeaveSchema);
export default Leave;
