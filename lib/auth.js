import axiosInstance from './axios';

// Login API call
export const loginUser = async (username, password) => {
  try {
    const response = await axiosInstance.post('/auth/login', {
      username,
      password,
    });
    
    // Save token to localStorage
    localStorage.setItem('token', response.data.accessToken);
    
    return response.data;
  } catch (error) {
    // Return error message for UI
    throw error.response?.data?.message || 'Login failed';
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