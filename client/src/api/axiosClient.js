import axios from 'axios';
import toast from 'react-hot-toast';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token from localStorage if present
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('ekchhatra_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Catch errors and trigger toast notification
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.detail || error.message || 'An unexpected error occurred';
    
    // Don't toast 401 on optional auth checks
    if (error.response?.status !== 401 || !error.config?.url?.includes('/me')) {
      toast.error(message, {
        id: error.config?.url, // prevent duplicate toasts
        duration: 4000,
        style: {
          background: '#1a1a2e',
          color: '#f87171',
          border: '1px solid rgba(239, 68, 68, 0.3)'
        }
      });
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
