import axios from 'axios';
import toast from 'react-hot-toast';

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  withCredentials: true,
});

// Add a response interceptor
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 429) {
      const message = error.response.data.message || 'Too many requests. Please slow down!';
      toast.error(message, {
        id: 'rate-limit-error', // Prevent duplicate toasts
        duration: 4000,
      });
    }
    return Promise.reject(error);
  }
);

export default instance;