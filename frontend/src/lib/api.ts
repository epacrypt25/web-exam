import axios from "axios";

const API_AUTH = axios.create({
  baseURL: "http://localhost:8080",
  headers: { "Content-Type": "application/json" },
});

const API_USER = axios.create({
  baseURL: "http://localhost:8081",
  headers: { "Content-Type": "application/json" },
});

const API_CLASS = axios.create({
  baseURL: "http://localhost:8082",
  headers: { "Content-Type": "application/json" },
});

const API_EXAM = axios.create({
  baseURL: "http://localhost:8083",
  headers: { "Content-Type": "application/json" },
});

// Request interceptor to inject JWT token for protected services
const attachToken = (config: any) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
};

API_USER.interceptors.request.use(attachToken);
API_CLASS.interceptors.request.use(attachToken);
API_EXAM.interceptors.request.use(attachToken);

export { API_AUTH, API_USER, API_CLASS, API_EXAM };
