import axiosInstance from './axios';

// Login API call
export const loginUser = async (username, password) => {
  try {
    const response = await axiosInstance.post('/auth/login', {
      username,
      password,
    });
    
    // Save token to localStorage. Some APIs return `accessToken` or `token`.
    const token = response.data?.accessToken || response.data?.token || response.data?.access_token;
    if (token) {
      localStorage.setItem('token', token);
    }
    
    return response.data;
  } catch (error) {
    // Return error message for UI
    throw error.response?.data?.message || error.message || 'Login failed';
  }
};

// Logout
export const logoutUser = () => {
  localStorage.removeItem('token');
};

// Check if user is logged in
export const isLoggedIn = () => {
  if (typeof window === 'undefined') return false;
  return !!localStorage.getItem('token');
};