'use client';

export default function ProductActions({
  product,
  onEdit,
  onDelete,
  isLoading,
}) {
  return (
    <div className="flex gap-2">
      {/* Edit Button */}
      <button
        onClick={() => onEdit(product)}
        disabled={isLoading}
        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition text-sm"
        title="Edit product"
      >
        ✏️ Edit
      </button>

      {/* Delete Button */}
      <button
        onClick={() => onDelete(product)}
        disabled={isLoading}
        className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition text-sm"
        title="Delete product"
      >
        🗑️ Delete
      </button>
    </div>
  );
}