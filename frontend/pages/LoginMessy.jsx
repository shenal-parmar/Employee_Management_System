import axios from "axios";
import  { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { userContext } from "../context/AuthContext.jsx";



const Login = () => {
  console.log("login called");
  
  const navigate = useNavigate()
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [error, seterror] = useState(null);
  const { login, logout, user } = useContext(userContext);
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:3000/api/auth/login", {
        email,
        password,
      });
      console.log("successfully turned to backend: ", res);
      if (res.data.success) {
        alert("successfully login");
        console.log("res on login:",res);
        localStorage.setItem("token",res.data.token);
        login(res.data.user.name);
        if (res.data.user.name == "admin") {
          navigate("/admin-dashboard");
        } else {
          navigate("/user-dashboard");
        }
      }
    } catch (error) {
      // console.log("error:",error);
      if (error.response && error.response.data.error) {
        seterror(error.response.data.error);
      } else {
        seterror("Server error");
      }
    }
  };
  return (
    <div className="flex flex-col items-center h-screen justify-center bg-gradient-to-b from-teal-600 from-50% to-gray-100 to-50% space-y-6">
      <h2 className="font-pacific text-3xl text-white">
        Employee Management System
      </h2>
      <div className="border shadow p-6 w-80 bg-white">
        <h2 className="text-2xl font-bold mb-4">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            {error && <p className="text-red-500">{error}</p>}
            <label htmlFor="email" className="block text-gray-700">
              Email
            </label>
            <input
              type="email"
              className="w-full px-3 py-2 border"
              placeholder="Enter Email"
              onChange={(e) => {
                setemail(e.target.value);
              }}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700">
              Password
            </label>
            <input
              type="password"
              className="w-full px-3 py-2 border"
              placeholder="*******"
              onChange={(e) => setpassword(e.target.value)}
              required
            />
          </div>
          <div className="mb-4 flex items-center justify-between">
            <label htmlFor="" className="inline-flex item-center">
              <input type="checkbox" className="form-checkbox" />
              <span className="ml-2 text-gray-700">Remember me</span>
            </label>
            <a href="#" className="text-teal-600">
              Forgot Password?
            </a>
          </div>
          <button type="submit" className="w-full bg-teal-600 text-white py-2">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};
export { submitLogin };
export default Login;
