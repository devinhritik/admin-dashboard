// ... existing code ...

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

// ===== PAGINATION HELPERS =====

// Calculate skip value from page number
export const calculateSkip = (page, limit) => {
  return (page - 1) * limit;
};

// Calculate total pages
export const calculateTotalPages = (total, limit) => {
  return Math.ceil(total / limit);
};

// Get pagination info
export const getPaginationInfo = (page, limit, total, productsCount) => {
  const skip = calculateSkip(page, limit);
  const startIndex = skip + 1;
  const endIndex = skip + productsCount;
  const totalPages = calculateTotalPages(total, limit);
  
  return {
    startIndex,
    endIndex,
    totalPages,
    skip,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
};

// Validate and sanitize page number
export const validatePageNumber = (page, totalPages) => {
  const pageNum = parseInt(page, 10);
  
  // If invalid or less than 1, return 1
  if (isNaN(pageNum) || pageNum < 1) {
    return 1;
  }
  
  // If greater than total pages, return last page
  if (pageNum > totalPages) {
    return totalPages;
  }
  
  return pageNum;
};

// Valid page sizes
export const VALID_LIMITS = [10, 20, 50];

// Validate limit
export const validateLimit = (limit) => {
  const limitNum = parseInt(limit, 10);
  return VALID_LIMITS.includes(limitNum) ? limitNum : 10;
};


// ===== SEARCH HELPERS =====

// Track request IDs to prevent race conditions
let searchRequestId = 0;

// Generate unique request ID
export const generateRequestId = () => {
  searchRequestId += 1;
  return searchRequestId;
};

// Reset request ID (useful for testing)
export const resetRequestId = () => {
  searchRequestId = 0;
};

// Debounce function - wait before executing
export const debounceSearch = (func, delay = 500) => {
  let timeoutId;
  let requestId = null;

  const debounced = (...args) => {
    // Clear previous timeout
    clearTimeout(timeoutId);
    
    // Generate new request ID
    requestId = generateRequestId();
    
    // Set new timeout
    timeoutId = setTimeout(() => {
      func(requestId, ...args);
    }, delay);
  };

  return debounced;
};

// Check if this is the latest search request
export const isLatestRequest = (currentRequestId, latestRequestId) => {
  return currentRequestId === latestRequestId;
};