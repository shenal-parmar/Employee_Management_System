import mongoose from "mongoose";

const SalarySchema = new mongoose.Schema(
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
    basic_salary: {
      type: Number,
      required: true,
    },
    allowance: {
      type: Number,
      default: 0,
    },
    deduction: {
      type: Number,
      default: 0,
    },
    total: {
      type: Number,
      default: function () {
        return this.basic_salary + this.allowance - this.deduction;
      },
    },
    pay_date: {
      type: Date,
    },
    month: {
      type: String,
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["Paid", "Pending", "Processing"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

const Salary = mongoose.model("Salary", SalarySchema);
export default Salary;
