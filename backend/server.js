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
const allowedOrigins = (process.env.CORS_ORIGINS || "")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);
console.log("CORS Allowed Origins:", allowedOrigins);

app.use(express.json());
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true); // allow mobile/postman
      if (allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      console.warn("❌ Blocked by CORS:", origin);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
); // allow all origins for dev; tighten in prod

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
