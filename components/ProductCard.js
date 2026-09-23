'use client';

import Image from 'next/image';
import { formatPrice } from '@/lib/utils';

export default function ProductCard({ product, onProductClick }) {
  return (
    <div
      onClick={() => onProductClick(product.id)}
      className="bg-white rounded-lg shadow hover:shadow-lg transition duration-200 overflow-hidden cursor-pointer"
    >
      {/* Image Container */}
      <div className="relative bg-gray-200 h-48 overflow-hidden">
        <Image
          src={product.thumbnail}
          alt={product.title}
          width={400}
          height={240}
          className="w-full h-full object-cover hover:scale-105 transition duration-200"
        />
        {/* Category Badge */}
        <span className="absolute top-2 right-2 bg-blue-600 text-white text-xs font-semibold px-2 py-1 rounded capitalize">
          {product.category}
        </span>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Title */}
        <h3 className="text-sm font-bold text-gray-800 line-clamp-2 mb-2">
          {product.title}
        </h3>

        {/* Rating */}
        <div className="flex items-center mb-3">
          <span className="text-xs text-gray-600">⭐ {product.rating}</span>
        </div>

        {/* Price and Stock */}
        <div className="flex justify-between items-center mb-3">
          <span className="text-lg font-bold text-blue-600">
            {formatPrice(product.price)}
          </span>
          <span
            className={`text-xs font-semibold px-2 py-1 rounded ${
              product.stock > 0
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {product.stock > 0 ? 'In Stock' : 'Out'}
          </span>
        </div>

        {/* View Details Button */}
        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold py-2 px-4 rounded transition duration-200">
          View Details
        </button>
      </div>
    </div>
  );
}