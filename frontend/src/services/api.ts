import axios from "axios";

const api = axios.create({
  baseURL: "https://www.greencore.com.mx/api/",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;