import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
// import authRoutes from "./routes/auth.js";
import empRoutes from "./routes/employeeRoutes.js";
import deptRoutes from "./routes/departmentRoutes.js";
import salaryRoutes from "./routes/salaryRoutes.js"
import leaveRoutes from "./routes/leaveRoutes.js"
import userRoutes from "./routes/userRoutes.js"
import authRoutes from "./routes/authRoutes.js"


dotenv.config();
const app = express();
app.use(express.json());
app.use(cors()); // allow all origins for dev; tighten in prod

// app.use("/api/auth", authRoutes);
app.use("/api/leaves", leaveRoutes);
app.use("/api/salaries", salaryRoutes);
app.use("/api/users", userRoutes);
app.use("/api/employees", empRoutes);
app.use("/api/departments", deptRoutes);
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 3000;
mongoose.connect(process.env.MONGO_URI)
  .then(()=> app.listen(PORT, ()=> console.log(`Backend running ${PORT}`)))
  .catch(err=> console.error(err));
