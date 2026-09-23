// Debounce function - waits for user to stop typing
export const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

// Format price to currency
export const formatPrice = (price) => {
  return `$${price.toFixed(2)}`;
};

// Check if token exists
export const getToken = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
};

// Handle API errors gracefully
export const getErrorMessage = (error) => {
  return error.response?.data?.message || error.message || 'Something went wrong';
};