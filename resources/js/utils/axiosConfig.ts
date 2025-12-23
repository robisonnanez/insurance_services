import axios from 'axios';

const protocol = window.location.protocol;
const dominioActual = window.location.hostname;

const base_url = `${protocol}//${dominioActual}:8000`;

const api = axios.create({
  baseURL: `${base_url}`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Si usamos token (por ejemplo, JWT)
// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem('token'); // o sessionStorage
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

export default api;
