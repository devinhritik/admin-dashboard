'use client';

import { useState, useEffect } from 'react';
import { VALID_SORTS, getSortLabel } from '@/lib/utils';

export default function FilterSort({
  categories = [],
  selectedCategory,
  selectedSort,
  onCategoryChange,
  onSortChange,
  isLoading,
  isSearching,
}) {
  const [expandedOnMobile, setExpandedOnMobile] = useState(false);

  // Ensure categories is always an array and normalize object-based values
  const safeCategories = Array.isArray(categories)
    ? categories
        .map((category) => {
          if (typeof category === 'string') {
            return { value: category, label: category };
          }

          if (category && typeof category === 'object') {
            const value = category.slug || category.name || category.value || '';
            if (!value) return null;
            return { value, label: category.name || value };
          }

          return null;
        })
        .filter(Boolean)
    : [];

  return (
    <div className="mb-6 bg-white rounded-lg shadow p-4">
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setExpandedOnMobile(!expandedOnMobile)}
        className="md:hidden w-full flex items-center justify-between text-left font-semibold text-gray-800 mb-4"
      >
        <span>Filter & Sort</span>
        <span>{expandedOnMobile ? '▼' : '▶'}</span>
      </button>

      {/* Filter & Sort Controls */}
      <div
        className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${
          expandedOnMobile ? 'block' : 'hidden md:grid'
        }`}
      >
        {/* Category Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            disabled={isLoading || isSearching}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
          >
            <option value="">All Categories</option>
            {safeCategories.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label.charAt(0).toUpperCase() + category.label.slice(1)}
              </option>
            ))}
          </select>

          {/* Warning when searching */}
          {isSearching && (
            <p className="text-xs text-amber-600 mt-1">
              💡 Filters disabled during search. Clear search to use filters.
            </p>
          )}
        </div>

        {/* Sort Options */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sort By
          </label>
          <select
            value={selectedSort}
            onChange={(e) => onSortChange(e.target.value)}
            disabled={isLoading}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
          >
            {VALID_SORTS.map((sort) => (
              <option key={sort} value={sort}>
                {getSortLabel(sort)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Active Filters Display */}
      {(selectedCategory || selectedSort !== 'none') && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-sm text-gray-600">Active filters:</span>

            {selectedCategory && (
              <span className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                📁 {selectedCategory}
                <button
                  onClick={() => onCategoryChange('')}
                  className="text-blue-600 hover:text-blue-800 font-bold"
                  type="button"
                >
                  ✕
                </button>
              </span>
            )}

            {selectedSort !== 'none' && (
              <span className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                📊 {getSortLabel(selectedSort)}
                <button
                  onClick={() => onSortChange('none')}
                  className="text-green-600 hover:text-green-800 font-bold"
                  type="button"
                >
                  ✕
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}