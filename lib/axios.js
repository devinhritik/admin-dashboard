import axios from 'axios';

// Create Axios instance with base URL
const axiosInstance = axios.create({
  baseURL: 'https://dummyjson.com',
  timeout: 10000, // 10 seconds timeout
});

// REQUEST INTERCEPTOR - Add token to every request
axiosInstance.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    
    // If token exists, add it to headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// RESPONSE INTERCEPTOR - Handle errors globally
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // If 401 (Unauthorized), redirect to login
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    
    // Return error so components can handle it
    return Promise.reject(error);
  }
);

export default axiosInstance;