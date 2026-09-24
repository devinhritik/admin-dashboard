'use client';

import { useState } from 'react';
import {
  validateProductForm,
  sanitizeProductData,
} from '@/lib/validation';

const createDefaultFormData = (initialData = null) => ({
  title: initialData?.title || '',
  description: initialData?.description || '',
  price: initialData?.price?.toString() || '',
  stock: initialData?.stock?.toString() || '',
  category: initialData?.category || '',
  rating: initialData?.rating?.toString() || '',
  brand: initialData?.brand || '',
  thumbnail: initialData?.thumbnail || '',
});

export default function ProductForm({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
  initialData = null,
  categories = [],
}) {
  const [formData, setFormData] = useState(() =>
    createDefaultFormData(initialData)
  );

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { isValid, errors: validationErrors } =
      validateProductForm(formData);

    if (!isValid) {
      setErrors(validationErrors);
      return;
    }

    const sanitized = sanitizeProductData(formData);

    await onSubmit(sanitized);

    onClose();
  };

  const handleClose = () => {
    setFormData(createDefaultFormData());
    setErrors({});
    onClose();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg bg-white">
        {/* Header */}
        <div className="flex items-center justify-between border-b p-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {initialData ? 'Edit Product' : 'Add New Product'}
          </h2>

          <button
            type="button"
            onClick={handleClose}
            className="text-2xl text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 p-6">
          {/* Title */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Title *
            </label>

            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Product title"
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {errors.title && (
              <p className="mt-1 text-sm text-red-600">
                {errors.title}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Description *
            </label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Product description"
              rows={3}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {errors.description && (
              <p className="mt-1 text-sm text-red-600">
                {errors.description}
              </p>
            )}
          </div>

          {/* Price & Stock */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Price */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Price *
              </label>

              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="0.00"
                min="0"
                step="0.01"
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              {errors.price && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.price}
                </p>
              )}
            </div>

            {/* Stock */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Stock *
              </label>

              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                placeholder="0"
                min="0"
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              {errors.stock && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.stock}
                </p>
              )}
            </div>
          </div>

          {/* Category & Rating */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Category */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Category *
              </label>

              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select category</option>

                {Array.isArray(categories) &&
                  categories.map((cat) => {
                    const categoryValue =
                      typeof cat === 'string' ? cat : cat?.name;

                    if (!categoryValue) {
                      return null;
                    }

                    const categoryLabel =
                      categoryValue.charAt(0).toUpperCase() +
                      categoryValue.slice(1);

                    return (
                      <option
                        key={categoryValue}
                        value={categoryValue}
                      >
                        {categoryLabel}
                      </option>
                    );
                  })}
              </select>

              {errors.category && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.category}
                </p>
              )}
            </div>

            {/* Rating */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Rating
              </label>

              <input
                type="number"
                name="rating"
                value={formData.rating}
                onChange={handleChange}
                placeholder="0-5"
                min="0"
                max="5"
                step="0.1"
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              {errors.rating && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.rating}
                </p>
              )}
            </div>
          </div>

          {/* Brand & Thumbnail */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Brand */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Brand
              </label>

              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                placeholder="Product brand"
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Thumbnail */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Thumbnail URL
              </label>

              <input
                type="url"
                name="thumbnail"
                value={formData.thumbnail}
                onChange={handleChange}
                placeholder="https://..."
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 border-t pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 rounded-lg border border-gray-300 px-4 py-2 font-medium text-gray-700 transition hover:bg-gray-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
            >
              {isLoading ? 'Saving...' : 'Save Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

