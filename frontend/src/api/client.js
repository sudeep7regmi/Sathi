import axios from 'axios';

// Vite proxies /api → http://localhost:5000 in dev (see vite.config.js)
const api = axios.create({ baseURL: '/api' });

// Attach JWT from localStorage on every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('sathi.token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// On 401, clear session
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('sathi.token');
    }
    return Promise.reject(err);
  }
);

export default api;
