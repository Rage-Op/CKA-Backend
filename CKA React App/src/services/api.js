import axios from "axios";

const API_BASE_URL = import.meta.env.PROD ? "" : "http://localhost:3000";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Auth APIs
export const login = (credentials) => api.post("/login", credentials);
export const logout = () => api.post("/logout");

// Student APIs
export const getStudents = () => api.get("/students");
export const getAscendingStudents = () => api.get("/ascending-students");
export const searchStudent = (studentId) =>
  api.get(`/students/search/${studentId}`);
export const addStudent = (student) => api.post("/students/add", student);
export const updateStudent = (studentId, updates) =>
  api.patch(`/students/update/${studentId}`, updates);
export const deleteStudent = (studentId) =>
  api.delete(`/students/delete/${studentId}`);

// Settings APIs
export const getSettings = () => api.get("/settings");
export const updateSettings = (settings) => api.patch("/settings", settings);

// Debit Log APIs
export const getDebitLog = () => api.get("/debit-log");
export const updateDebitLog = (log) => api.patch("/debit-log", log);

// Fees APIs
export const debitFees = (updates) => api.patch("/debit", updates);

// Backup API
export const backup = () => api.get("/backup");

// Date API
export const getBSDate = () => api.get("/bs-date");

export default api;
