// Validate product form data
export const validateProductForm = (formData) => {
  const errors = {};

  // Title validation
  if (!formData.title || !formData.title.trim()) {
    errors.title = 'Title is required';
  } else if (formData.title.trim().length < 3) {
    errors.title = 'Title must be at least 3 characters';
  }

  // Description validation
  if (!formData.description || !formData.description.trim()) {
    errors.description = 'Description is required';
  } else if (formData.description.trim().length < 10) {
    errors.description = 'Description must be at least 10 characters';
  }

  // Price validation
  if (!formData.price) {
    errors.price = 'Price is required';
  } else if (isNaN(formData.price) || parseFloat(formData.price) <= 0) {
    errors.price = 'Price must be a positive number';
  }

  // Stock validation
  if (formData.stock === '' || formData.stock === null) {
    errors.stock = 'Stock is required';
  } else if (isNaN(formData.stock) || parseInt(formData.stock) < 0) {
    errors.stock = 'Stock must be a non-negative number';
  }

  // Category validation
  if (!formData.category || !formData.category.trim()) {
    errors.category = 'Category is required';
  }

  // Rating validation (optional, but validate if provided)
  if (formData.rating && (isNaN(formData.rating) || formData.rating < 0 || formData.rating > 5)) {
    errors.rating = 'Rating must be between 0 and 5';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// Sanitize form data
export const sanitizeProductData = (formData) => {
  return {
    title: formData.title?.trim() || '',
    description: formData.description?.trim() || '',
    price: parseFloat(formData.price) || 0,
    stock: parseInt(formData.stock) || 0,
    category: formData.category?.trim() || '',
    rating: formData.rating ? parseFloat(formData.rating) : 0,
    brand: formData.brand?.trim() || '',
    thumbnail: formData.thumbnail?.trim() || '',
  };
};