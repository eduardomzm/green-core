import axios from "axios";

const isProduction = import.meta.env.PROD;
const devUrl = "http://localhost:8000/api/";
const prodUrl = "https://greencore-api-83ow.onrender.com/api/";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || (isProduction ? prodUrl : devUrl),
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Interceptor para manejar errores globales (falla de autenticación, etc.)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Si el servidor responde con 401 (No autorizado), limpiamos el token
    // Esto es útil si el token de acceso ha expirado o no es válido
    if (error.response && error.response.status === 401) {
      if (!window.location.pathname.includes("/login")) {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        // window.location.href = "/login"; // Podría causar loops si no se maneja bien
      }
    }
    return Promise.reject(error);
  }
);

export default api;