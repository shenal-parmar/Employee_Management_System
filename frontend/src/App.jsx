import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./index.css";
import AdminDashboard from "../pages/AdminDashboard";
import UserDashboard from "../pages/EmployeeDashboard";
import Login from "../pages/Login";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import EmployeeManagement from "../pages/EmployeeManagement";
import DepartmentManagement from "../pages/DepartmentManagement";
import LeaveManagement from "../pages/LeaveManagement";
import SalaryManagement from "../pages/SalaryManagement";
import Reports from "../pages/Reports";
import "./App.css";
import Navbar from "../pages/Navbar";
import ProfilePage from "../pages/ProfilePage";
import ProtectedRoute from "../pages/ProtectedRoute";
import EmployeeDashboard from "../pages/EmployeeDashboard";
import EmployeeRegister from "../pages/EmployeeRegister";
import PendingEmployees from "../pages/PendingEmployees";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Navbar></Navbar>
{/* {localStorage.removeItem("token")
}{console.log("token: ",localStorage.getItem("token"))} */}
      <Routes>
        <Route path="/" element={<Login />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/reports" element={<Reports />}></Route>
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/employee-dashboard"
          element={
            <ProtectedRoute role="employee">
              <EmployeeDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/employeeManagement"
          element={<EmployeeManagement />}
        ></Route>
        <Route
          path="/departmentManagement"
          element={<DepartmentManagement />}
        ></Route>
        
        <Route path="/pending-employees" element={<PendingEmployees />}></Route>
        <Route path="/leaves" element={<LeaveManagement />}></Route>
        <Route path="/salaryManagement" element={<SalaryManagement />}></Route>
        <Route path="/employeeRegister" element={<EmployeeRegister />}></Route>
        <Route path="/profile" element={<ProfilePage />}></Route>
        <Route path="/profile/:id" element={<ProfilePage />} />

        {/* <Route element={<AuthContext></AuthContext> }></Route> */}
      </Routes>

      {/* <AdminDashboard /> */}
    </>
  );
}

export default App;
