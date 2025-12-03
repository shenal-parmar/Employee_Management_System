import React, { useState, useEffect } from "react";
import { getCurrentUser } from "../src/api/userApi";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  FaUsers,
  FaCalendarAlt,
  FaDollarSign,
  FaBuilding,
  FaChartBar,
  FaClock,
  FaCheckCircle,
  FaPlus,
  FaArrowRight,
  FaExclamationCircle,
  FaFileAlt,
} from "react-icons/fa";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import api from "../src/api/api.js";
// import {io} from "socket.io-client"

// const socket = io(`${import.meta.env.VITE_API_URL?.replace(/\/$/, '')}`, {
//   transports: ["websocket"],
// });

export default function AdminDashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    };
    fetchUser();
    // socket.on("notification", (data) => {
    //       console.log("Notification:", data);
    //       toast.info(data.message);
    //     });
    //     return () => socket.off("notification");
  }, []);
// useEffect(() => {
//   socket.on("notification", (data) => {
//     if (data.type === "leave_applied") {
//       toast.success(data.message);  // Admin sees toast
//     }
//   });

//   return () => {
//     socket.off("notification");
//   };
// }, []);

  // Fetch data
  const { data: employees = [] } = useQuery({
    queryKey: ["employees"],
    queryFn: async () => {
      try {
        const res = await api.get(`/employees`);
        return res.data || [];
      } catch (err) {
        console.error("Error fetching employees:", err);
        return [];
      }
    },
  });
  const { data: pendingEmployees = [] } = useQuery({
    queryKey: ["pendingEmployees"],
    queryFn: async () => {
      try {
        const res = await api.get(`/employees/pending`);
        return res.data || [];
      } catch (err) {
        console.error("Error fetching pending employees:", err);
        return [];
      }
    },
  });

  const { data: departments = [] } = useQuery({
    queryKey: ["departments"],
    queryFn: async () => {
      try {
        const res = await api.get(`/departments`);
        return res.data || [];
      } catch (err) {
        console.error("Error fetching departments:", err);
        return [];
      }
    },
  });

  const { data: leaves = [] } = useQuery({
    queryKey: ["leaves"],
    queryFn: async () => {
      try {
        const res = await api.get(`/leaves`);
        return res.data || [];
      } catch (err) {
        console.error("Error fetching leaves:", err);
        return [];
      }
    },
  });

  const { data: salaries = [] } = useQuery({
    queryKey: ["salaries"],
    queryFn: async () => {
      try {
        const res = await api.get(`/salaries`);
        return res.data || [];
      } catch (err) {
        console.error("Error fetching salaries:", err);
        return [];
      }
    },
  });

  // Calculations
  const pendingLeaves = leaves.filter((l) => l.status === "Pending");
  const totalSalaryPaid = salaries
    .filter((s) => s.status === "Paid")
    .reduce((sum, s) => sum + (s.total || 0), 0);

  const getDepartmentStats = () => {
    return departments.map((dept) => {
      const deptId = dept._id?.toString();
      const deptEmployees = employees.filter((e) => e.department === deptId);

      const avgSalary =
        deptEmployees.length > 0
          ? deptEmployees.reduce((sum, e) => sum + (e.salary || 0), 0) /
            deptEmployees.length
          : 0;

      return {
        ...dept,
        employeeCount: deptEmployees.length,
        avgSalary,
      };
    });
  };

  const departmentStats = getDepartmentStats();

  const getRecentActivities = () => {
    const activities = [];

    employees.slice(0, 3).forEach((emp) => {
      activities.push({
        title: "New Employee Joined",
        description: `${emp.name} joined as ${emp.designation}`,
        time: emp.created_date,
        icon: <FaUsers className="text-[#93BFC7]" />,
      });
    });

    leaves.slice(0, 3).forEach((leave) => {
      const icon =
        leave.status === "Approved" ? (
          <FaCheckCircle className="text-green-600" />
        ) : leave.status === "Rejected" ? (
          <FaExclamationCircle className="text-red-600" />
        ) : (
          <FaClock className="text-[#CBF3BB]" />
        );
      activities.push({
        title: `Leave ${leave.status}`,
        description: `${leave.employee_name} - ${leave.leave_type}`,
        time: leave.created_date,
        icon,
      });
    });

    return activities.sort((a, b) => new Date(b.time) - new Date(a.time));
  };

  const recentActivities = getRecentActivities();

  const stats = [
    {
  title: "Pending Employee Approvals",
  value: pendingEmployees.length,
  icon: <FaExclamationCircle className="text-red-500 text-3xl" />,
  color: "bg-red-200",
  link: "/pending-employees", // define route as needed
},
   ,
    {
      title: "Active Departments",
      value: departments.length,
      icon: <FaBuilding className="text-[#93BFC7] text-3xl" />,
      color: "bg-[#ABE7B2]/30",
      link: "/departmentManagement",
    },
    {
      title: "Pending Approvals",
      value: pendingLeaves.length,
      icon: <FaExclamationCircle className="text-[#CBF3BB] text-3xl" />,
      color: "bg-[#CBF3BB]/40",
      link: "/leaves",
    },
    {
      title: "Monthly Payroll",
      value: `$${totalSalaryPaid.toLocaleString()}`,
      icon: <FaDollarSign className="text-[#ABE7B2] text-3xl" />,
      color: "bg-[#ECF4E8]/80",
      link: "/salaryManagement",
    },
  ];

  return (
  <main className="p-4 sm:p-6 md:p-8 space-y-8 bg-[#ECF4E8] min-h-screen">
    <section className="max-w-7xl mx-auto">
      
      {/* Welcome Section */}
      <header className="mb-6 sm:mb-8 text-center sm:text-left">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#4F6F75] mb-2">
          Welcome back, {user?.full_name || "Admin"}! 👋
        </h1>
        <p className="text-gray-600 text-sm sm:text-base">
          Here’s your organization overview.
        </p>
      </header>

      {/* Stats Section */}
      <section  className="
        grid 
        grid-cols-1 
        sm:grid-cols-2 
        lg:grid-cols-4 
        gap-4 sm:gap-6 
        mb-8
      ">
        {stats.map((stat, i) => (
          <Link
            to={stat.link}
            key={i}
            className="bg-white shadow-md rounded-xl p-5 sm:p-6 hover:shadow-lg hover:-translate-y-1 transition"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${stat.color}`}>
                {stat.icon}
              </div>
              <FaArrowRight className="text-gray-400" />
            </div>
            <p className="text-gray-500 text-sm">{stat.title}</p>
            <p className="text-xl sm:text-2xl font-bold text-gray-900">
              {stat.value}
            </p>
          </Link>
        ))}
      </section >

      {/* Quick Actions */}
      <section  className="bg-white shadow-lg rounded-xl p-5 sm:p-6 mb-8">
        <h2 className="text-lg sm:text-xl font-semibold mb-4 flex items-center gap-2 text-[#4F6F75]">
          <FaClock /> Quick Actions
        </h2>

        <div className="
          grid 
          grid-cols-1 
          sm:grid-cols-2 
          lg:grid-cols-4 
          gap-4
        ">
          <Link
            className="p-4 rounded-xl bg-[#93BFC7]/30 text-center hover:shadow-md transition"
            to="/leaves"
          >
            <FaCalendarAlt className="text-[#93BFC7] text-3xl mx-auto mb-2" />
            <p className="font-semibold text-sm sm:text-base">Pending Leaves</p>
            <p className="text-gray-600 text-xs sm:text-sm">
              {pendingLeaves.length} Requests
            </p>
          </Link>

          <Link
            className="p-4 rounded-xl bg-[#ABE7B2] text-center hover:shadow-md transition"
            to="/salaryManagement"
          >
            <FaDollarSign className="text-[#4F6F75] text-3xl mx-auto mb-2" />
            <p className="font-semibold text-sm sm:text-base">Salary Overview</p>
            <p className="text-gray-600 text-xs sm:text-sm">
              ${totalSalaryPaid.toLocaleString()} Paid
            </p>
          </Link>

          <Link
            className="p-4 rounded-xl bg-[#CBF3BB] text-center hover:shadow-md transition"
            to="/employeeManagement"
          >
            <FaPlus className="text-[#4F6F75] text-3xl mx-auto mb-2" />
            <p className="font-semibold text-sm sm:text-base">Add Employee</p>
            <p className="text-gray-600 text-xs sm:text-sm">Create new record</p>
          </Link>

          <Link
            className="p-4 rounded-xl bg-[#ECF4E8] text-center hover:shadow-md transition"
            to="/reports"
          >
            <FaFileAlt className="text-[#4F6F75] text-3xl mx-auto mb-2" />
            <p className="font-semibold text-sm sm:text-base">Reports</p>
            <p className="text-gray-600 text-xs sm:text-sm">View insights</p>
          </Link>
        </div>
      </section >

      {/* Recent Activities */}
      <section  className="bg-white shadow-lg rounded-xl p-5 sm:p-6 mb-8">
        <h2 className="text-lg sm:text-xl font-semibold flex items-center gap-2 text-[#4F6F75]">
          <FaChartBar /> Recent Activities
        </h2>

        <div className="mt-4 space-y-3">
          {recentActivities.slice(0, 6).map((a, i) => (
            <div
              key={i}
              className="flex items-start gap-3 p-3 rounded-lg hover:bg-[#ECF4E8]"
            >
              <div>{a.icon}</div>
              <div className="flex-1">
                <p className="font-medium text-gray-800 text-sm sm:text-base">
                  {a.title}
                </p>
                <p className="text-gray-600 text-xs sm:text-sm">
                  {a.description}
                </p>
                <p className="text-gray-400 text-xs">
                  {a?.time ? format(new Date(a.time), "MMM dd, h:mm a") : "-"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section >

      {/* Department Overview */}
      <section  className="bg-white shadow-lg rounded-xl p-5 sm:p-6 mb-8">
        <h2 className="text-lg sm:text-xl font-semibold flex items-center gap-2 text-[#4F6F75]">
          <FaBuilding /> Department Overview
        </h2>

        <div className="mt-4 space-y-4">
          {departmentStats.map((dept) => (
            <div
              key={dept._id}
              className="p-4 border rounded-lg bg-[#ECF4E8]"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 gap-2">
                <div>
                  <p className="font-semibold text-gray-900 text-sm sm:text-base">{dept.name}</p>
                  <p className="text-gray-600 text-xs sm:text-sm">
                    {dept.employeeCount} employees
                  </p>
                </div>
                <span className="text-xs sm:text-sm font-semibold text-[#4F6F75]">
                  Avg: ${dept.avgSalary.toFixed(0)}
                </span>
              </div>

              <div className="h-2 w-full bg-[#ABE7B2]/50 rounded-full">
                <div
                  className="h-2 bg-[#93BFC7] rounded-full"
                  style={{
                    width: `${(dept.employeeCount / employees.length) * 100 || 0}%`,
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </section >
    </section>
  </main>
);
}
