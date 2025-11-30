import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";

import empRoutes from "./routes/employeeRoutes.js";
import deptRoutes from "./routes/departmentRoutes.js";
import salaryRoutes from "./routes/salaryRoutes.js";
import leaveRoutes from "./routes/leaveRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();
const app = express();

// IMPORTANT → create HTTP server for Socket.IO
const server = http.createServer(app);

// SOCKET.IO SETUP
export const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],  // frontend
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// CORS SETUP
app.use(
  cors({
    origin: ["http://localhost:5173"], // frontend
    credentials: true,
  })
);

app.use(express.json());

// ROUTES
app.use("/api/leaves", leaveRoutes);
app.use("/api/salaries", salaryRoutes);
app.use("/api/users", userRoutes);
app.use("/api/employees", empRoutes);
app.use("/api/departments", deptRoutes);
app.use("/api/auth", authRoutes);

app.use("/uploads", express.static("uploads"));

const PORT = process.env.PORT || 3000;

// MONGO + START SERVER CORRECTLY
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    // THIS is the correct server start
    server.listen(PORT, () =>
      console.log(`Backend running with Socket.IO on port ${PORT}`)
    );
  })
  .catch((err) => console.error(err));
