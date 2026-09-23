'use client';

export default function Pagination({
  currentPage,
  totalPages,
  limit,
  total,
  startIndex,
  endIndex,
  onPageChange,
  onLimitChange,
  isLoading,
}) {
  // Generate array of page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
    
    if (endPage - startPage < maxPagesToShow - 1) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  const pageNumbers = getPageNumbers();
  const hasPrevPage = currentPage > 1;
  const hasNextPage = currentPage < totalPages;

  return (
    <div className="mt-8 bg-white rounded-lg shadow p-4">
      {/* Info Text */}
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Showing <span className="font-semibold">{startIndex}</span> to{' '}
          <span className="font-semibold">{endIndex}</span> of{' '}
          <span className="font-semibold">{total}</span> products
        </p>

        {/* Page Size Selector */}
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">Items per page:</label>
          <select
            value={limit}
            onChange={(e) => onLimitChange(parseInt(e.target.value))}
            disabled={isLoading}
            className="px-3 py-1 border border-gray-300 rounded text-sm disabled:bg-gray-100"
          >
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
          </select>
        </div>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-center gap-2 flex-wrap">
        {/* Previous Button */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!hasPrevPage || isLoading}
          className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed transition text-sm font-medium"
        >
          ← Previous
        </button>

        {/* First page button (if not showing) */}
        {pageNumbers[0] > 1 && (
          <>
            <button
              onClick={() => onPageChange(1)}
              disabled={isLoading}
              className="px-3 py-2 border border-gray-300 rounded hover:bg-gray-50 text-sm font-medium"
            >
              1
            </button>
            {pageNumbers[0] > 2 && (
              <span className="text-gray-400 px-2">...</span>
            )}
          </>
        )}

        {/* Page Number Buttons */}
        {pageNumbers.map((pageNum) => (
          <button
            key={pageNum}
            onClick={() => onPageChange(pageNum)}
            disabled={isLoading}
            className={`px-3 py-2 border rounded text-sm font-medium transition ${
              pageNum === currentPage
                ? 'bg-blue-600 text-white border-blue-600'
                : 'border-gray-300 hover:bg-gray-50'
            } disabled:cursor-not-allowed`}
          >
            {pageNum}
          </button>
        ))}

        {/* Last page button (if not showing) */}
        {pageNumbers[pageNumbers.length - 1] < totalPages && (
          <>
            {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
              <span className="text-gray-400 px-2">...</span>
            )}
            <button
              onClick={() => onPageChange(totalPages)}
              disabled={isLoading}
              className="px-3 py-2 border border-gray-300 rounded hover:bg-gray-50 text-sm font-medium"
            >
              {totalPages}
            </button>
          </>
        )}

        {/* Next Button */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!hasNextPage || isLoading}
          className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed transition text-sm font-medium"
        >
          Next →
        </button>
      </div>

      {/* Mobile-friendly info */}
      <div className="mt-4 text-center text-xs text-gray-600 md:hidden">
        Page {currentPage} of {totalPages}
      </div>
    </div>
  );
}