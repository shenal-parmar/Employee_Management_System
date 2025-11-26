import axios from "axios";
import { useContext, useEffect } from "react";
import { useState } from "react";
import { createContext } from "react";
import Login from "../pages/Login";
const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL?.replace(/\/$/, '')}/api`,
});
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
    // console.log("TOKEN SENDING → ", token);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
export const userContext = createContext();
const AuthContext = ({ children }) => {
  const [user, setuser] = useState();
  const [Loading, setLoading] = useState(true);
  console.log("authcontext called");
 useEffect(() => {
  const verifyToken = async () => {
    // console.log("token in verify b4:",token);
    const token = localStorage.getItem("token");
    // console.log("token in verify:",token);
    if (!token) {
      setuser(null);
      setLoading(false);
      return;
    }
    try {
      const res = await api.get(`/auth/verify`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) setuser(res.data.user);
      else setuser(null);
    } catch (error) {
      console.error("Error verifying token:", error);
      setuser(null);
    } finally {
      setLoading(false);
    }
  };

  verifyToken();
}, []);

const login = (user) => {
    // console.log("authcontext login called");
    setuser(user);
  };
  const logout = () => {
    // console.log("authcontext logout called");
    localStorage.removeItem("token");
    setuser(null);
  };
  return (
    <userContext.Provider value={{login,logout, user, Loading }}>
      {children}
      {/* <Login/> */}
    </userContext.Provider>
  );
};

export const useAuth = () => useContext(userContext);
export default AuthContext;
