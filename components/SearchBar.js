'use client';

import { useState, useEffect, useRef } from 'react';

export default function SearchBar({
  value,
  onChange,
  isLoading,
  placeholder = 'Search products...',
}) {
  const [input, setInput] = useState('');
  const inputRef = useRef(null);

  // Sync input with URL value prop
  useEffect(() => {
    // Only clear if value is empty (from URL)
    if (value === '') {
      setInput('');
    }
  }, [value]);

  // Handle input change
  const handleChange = (e) => {
    const newValue = e.target.value;
    
    // Update local input immediately for smooth typing
    setInput(newValue);
    
    // Call parent handler (which has debounce)
    onChange(newValue);
  };

  // Handle clear button
  const handleClear = () => {
    // Clear input
    setInput('');
    
    // Call parent to clear search
    onChange('');
    
    // Focus back on input so user can type immediately
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 0);
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
          className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
        />

        {/* Icons Container */}
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
          {/* Clear Button - Only show if there's text */}
          {input && !isLoading && (
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

          {/* Loading Spinner */}
          {isLoading && (
            <div className="w-5 h-5 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin flex-shrink-0"></div>
          )}

          {/* Search Icon */}
          {!isLoading && (
            <span className="text-gray-400 text-lg flex-shrink-0">🔍</span>
          )}
        </div>
      </div>

      {/* Helper Text - Show when typing */}
      {input && (
        <p className="text-xs text-gray-600 mt-2">
          Searching for: <span className="font-semibold">"{input}"</span>
        </p>
      )}
    </div>
  );
}