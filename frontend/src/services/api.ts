import axios from "axios";

const api = axios.create({
<<<<<<< HEAD
  baseURL: "http://127.0.0.1:8000/api/",
=======
  baseURL: "https://greencore-api-83ow.onrender.com/api/",
>>>>>>> 4efd12140e89a75c1790f98ffe47240ae519c39e
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;