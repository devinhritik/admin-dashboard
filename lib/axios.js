import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://dummyjson.com',
  timeout: 10000,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');

      if (typeof window !== 'undefined') {
        const currentPath = window.location.pathname;
        if (currentPath !== '/login') {
          window.history.replaceState(null, '', '/login');
        }
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;