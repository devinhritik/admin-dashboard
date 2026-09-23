import axiosInstance from '../axios';

// Get all products with pagination
export const getProducts = async (limit = 10, skip = 0) => {
  try {
    const response = await axiosInstance.get('/products', {
      params: { limit, skip },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get product by ID
export const getProductById = async (id) => {
  try {
    const response = await axiosInstance.get(`/products/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Search products
export const searchProducts = async (query, limit = 10, skip = 0) => {
  try {
    const response = await axiosInstance.get('/products/search', {
      params: { q: query, limit, skip },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get all categories
export const getCategories = async () => {
  try {
    const response = await axiosInstance.get('/products/categories');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get products by category
export const getProductsByCategory = async (category, limit = 10, skip = 0) => {
  try {
    const response = await axiosInstance.get(`/products/category/${category}`, {
      params: { limit, skip },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};