export default function EmptyState({ searchQuery }) {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center bg-blue-50 p-8 rounded-lg border border-blue-200 max-w-md">
        {/* Empty Icon */}
        <div className="text-5xl mb-4">📦</div>
        
        {/* Message */}
        <h3 className="text-lg font-bold text-gray-800 mb-2">
          {searchQuery ? 'No products found' : 'No products available'}
        </h3>
        <p className="text-gray-600 text-sm">
          {searchQuery 
            ? `We couldn't find any products matching "${searchQuery}". Try a different search term.`
            : 'There are no products to display.'}
        </p>
      </div>
    </div>
  );
}