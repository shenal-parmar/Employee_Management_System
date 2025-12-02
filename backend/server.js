import dotenv from "dotenv"
import express from "express"
import http from "http"
import { Server } from "socket.io"; 
import cors from "cors"; 
import morgan from "morgan"; 
import mongoose from "mongoose"; 
import leaveRoutes from "./routes/leaveRoutes.js"
import authRoutes from "./routes/authRoutes.js"
import deptRoutes from "./routes/departmentRoutes.js"
import empRoutes from "./routes/employeeRoutes.js"
import salaryRoutes from "./routes/salaryRoutes.js"
import userRoutes from "./routes/userRoutes.js"
import { sendMail } from "./utils/MailService.js";

dotenv.config();
const app = express();

// HTTP server for Socket.IO
const server = http.createServer(app);

// Allowed origins
const allowedOrigins = [
  "http://localhost:5173",
  "https://employee-management-system-zeta-nine.vercel.app",
  "https://employee-management-system-dlm7.onrender.com",
];
// console.log("BREVO API KEY:", process.env.BREVO_API_KEY);


// SOCKET.IO
export const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join_room", (userId) => {
    socket.join(userId);
    console.log("User joined room:", userId);
  });
});

app.use((req, res, next) => {
  req.io = io;
  next();
});
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error(`CORS blocked for origin: ${origin}`), false);
  },
  credentials: true,
  methods: ["GET","POST","PUT","PATCH","DELETE","OPTIONS"],
  allowedHeaders: ["Content-Type","Authorization"]
}));

app.get("/test-email", async (req, res) => {
  await sendMail({
    to: "shenal5420@gmail.com",
    subject: "Test email",
    text: "Hello from Brevo!",
  });
  res.send("Email sent");
});

app.use(morgan("dev"));
app.use(express.json());
app.use(express.static("public"));

// ROUTES
app.use("/api/leaves", leaveRoutes);
app.use("/api/salaries", salaryRoutes);
app.use("/api/users", userRoutes);
app.use("/api/employees", empRoutes);
app.use("/api/departments", deptRoutes);
app.use("/api/auth", authRoutes);
app.use("/uploads", express.static("uploads"));
app.set("view engine", "ejs");
app.set("views", "./views");
app.get("/server-home", (req, res) => {
  res.render("home");
});

const PORT = process.env.PORT || 3000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    server.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
  })
  .catch((err) => console.error(err));
