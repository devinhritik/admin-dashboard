import axiosInstance from '../axios';

// Add new product
export const addProduct = async (productData) => {
  try {
    const response = await axiosInstance.post('/products/add', productData);
    console.log('Product added:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error adding product:', error?.response?.data || error.message || error);
    throw new Error(error.response?.data?.message || error.message || 'Error adding product');
  }
};

// Edit product
export const updateProduct = async (id, productData) => {
  try {
    const response = await axiosInstance.put(`/products/${id}`, productData);
    console.log('Product updated:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};

// Delete product
export const deleteProduct = async (id) => {
  try {
    const response = await axiosInstance.delete(`/products/${id}`);
    console.log('Product deleted:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};

// Get all product categories
export const getCategories = async () => {
  try {
    const response = await axiosInstance.get('/products/categories');
    console.log('Categories:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

// Get all products with pagination
export const getProducts = async (limit = 10, skip = 0) => {
  try {
    const response = await axiosInstance.get('/products', {
      params: { limit, skip },
    });
    console.log('Products:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

// Get product by ID
export const getProductById = async (id) => {
  try {
    const response = await axiosInstance.get(`/products/${id}`);
    console.log('Product detail:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching product:', error);
    throw error;
  }
};

// Search products
export const searchProducts = async (query, limit = 10, skip = 0) => {
  try {
    const response = await axiosInstance.get('/products/search', {
      params: { q: query, limit, skip },
    });
    console.log('Search results:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error searching products:', error);
    throw error;
  }
};


// Get products by category
export const getProductsByCategory = async (category, limit = 10, skip = 0) => {
  try {
    const response = await axiosInstance.get(`/products/category/${category}`, {
      params: { limit, skip },
    });
    console.log('Category products:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching category products:', error);
    throw error;
  }
};
