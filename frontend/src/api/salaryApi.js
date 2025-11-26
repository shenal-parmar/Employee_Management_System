import api from "../api/api.js";
export const getSalaries = async () => {
  const res = await api.get("/salaries");
  return res.data;
};

export const getEmployees = async () => {
  const res = await api.get("/employees");
  return res.data;
};

export const createSalary = async (data) => {
  const res = await api.post("/salaries", data);
  console.log("salary data:",res);
  
  return res.data;
};

export const updateSalary = async (id, data) => {
  console.log("update data :",data);
  
  const res = await api.put(`/salaries/${id}`, data);
  return res.data;
};
