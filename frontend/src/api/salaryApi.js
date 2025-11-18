import axios from "axios";

const API_URL = "http://localhost:3000/api/salaries"; // your backend route

export const getSalaries = async () => {
  const res = await axios.get(API_URL);
  return res.data;
};

export const getEmployees = async () => {
  const res = await axios.get("http://localhost:3000/api/employees");
  return res.data;
};

export const createSalary = async (data) => {
  const res = await axios.post(API_URL, data);
  console.log("salary data:",res);
  
  return res.data;
};

export const updateSalary = async (id, data) => {
  console.log("update data :",data);
  
  const res = await axios.put(`${API_URL}/${id}`, data);
  return res.data;
};
