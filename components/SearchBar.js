'use client';

import { useRef } from 'react';

export default function SearchBar({
  value,
  onChange,
  isLoading,
  placeholder = 'Search products...',
}) {
  const inputRef = useRef(null);

  const handleChange = (e) => {
    onChange(e.target.value);
  };

  const handleClear = () => {
    onChange('');

    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  return (
    <div className="mb-6">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={isLoading}
          className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
        />

        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
          {value && !isLoading && (
            <button
              onClick={handleClear}
              className="text-gray-400 hover:text-gray-600 p-1 transition flex-shrink-0"
              title="Clear search"
              type="button"
              aria-label="Clear search"
            >
              ✕
            </button>
          )}

          {isLoading && (
            <div className="w-5 h-5 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin flex-shrink-0"></div>
          )}

          {!isLoading && (
            <span className="text-gray-400 text-lg flex-shrink-0">🔍</span>
          )}
        </div>
      </div>

      {value && (
        <p className="text-xs text-gray-600 mt-2">
          Searching for: <span className="font-semibold">{`"${value}"`}</span>
        </p>
      )}
    </div>
  );
}