'use client';

import { useState, useEffect, useRef } from 'react';

export default function SearchBar({
  value,
  onChange,
  isLoading,
  placeholder = 'Search products...',
}) {
  const [input, setInput] = useState(value || '');
  const inputRef = useRef(null);

  // When URL search param changes, update input (but don't lose focus)
  useEffect(() => {
    // Only update if different from current input
    if (value !== input) {
      setInput(value || '');
    }
  }, [value]);

  // Handle input change - DON'T update input state, let it be controlled
  const handleChange = (e) => {
    const newValue = e.target.value;
    
    // Update local state for immediate visual feedback
    setInput(newValue);
    
    // Call parent handler (which has debounce)
    onChange(newValue);
  };

  // Handle clear search
  const handleClear = () => {
    setInput('');
    onChange('');
    
    // Keep focus on input after clearing
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className="mb-6">
      <div className="relative">
        {/* Search Input */}
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={isLoading}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
        />

        {/* Search Icon / Clear Button */}
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
          {input && (
            <button
              onClick={handleClear}
              className="text-gray-400 hover:text-gray-600 p-1 transition"
              title="Clear search"
              type="button"
            >
              ✕
            </button>
          )}
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          ) : (
            <span className="text-gray-400">🔍</span>
          )}
        </div>
      </div>

      {/* Helper Text */}
      {input && (
        <p className="text-xs text-gray-600 mt-2">
          Searching for: <span className="font-semibold">"{input}"</span>
        </p>
      )}
    </div>
  );
}