'use client';

import { formatPrice } from '@/lib/utils';

export default function ProductTable({ products, onProductClick }) {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      {/* Table */}
      <table className="w-full">
        {/* Table Header */}
        <thead className="bg-gray-100 border-b border-gray-200">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Image</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Title</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Category</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Price</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Rating</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Stock</th>
          </tr>
        </thead>

        {/* Table Body */}
        <tbody>
          {products.map((product) => (
            <tr
              key={product.id}
              onClick={() => onProductClick(product.id)}
              className="border-b border-gray-200 hover:bg-gray-50 cursor-pointer transition"
            >
              {/* Image Cell */}
              <td className="px-6 py-4">
                <img
                  src={product.thumbnail}
                  alt={product.title}
                  className="w-12 h-12 object-cover rounded"
                />
              </td>

              {/* Title Cell */}
              <td className="px-6 py-4">
                <p className="text-sm font-medium text-gray-800 truncate max-w-xs">
                  {product.title}
                </p>
              </td>

              {/* Category Cell */}
              <td className="px-6 py-4">
                <span className="text-sm text-gray-600 capitalize">
                  {product.category}
                </span>
              </td>

              {/* Price Cell */}
              <td className="px-6 py-4">
                <span className="text-sm font-semibold text-gray-800">
                  {formatPrice(product.price)}
                </span>
              </td>

              {/* Rating Cell */}
              <td className="px-6 py-4">
                <div className="flex items-center">
                  <span className="text-sm text-gray-800">{product.rating}</span>
                  <span className="ml-1">⭐</span>
                </div>
              </td>

              {/* Stock Cell */}
              <td className="px-6 py-4">
                <span
                  className={`text-sm font-medium px-2 py-1 rounded ${
                    product.stock > 0
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}