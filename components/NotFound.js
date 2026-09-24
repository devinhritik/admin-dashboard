'use client';

import { useRouter } from 'next/navigation';

export default function NotFound({ productId }) {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center max-w-md">
        {/* 404 Icon */}
        <div className="text-6xl mb-4">📦</div>

        {/* Message */}
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Product Not Found</h1>
        <p className="text-gray-600 mb-4">
          The product with ID <code className="bg-gray-200 px-2 py-1 rounded">{productId}</code> doesn't
          exist or has been removed.
        </p>

        {/* Back Button */}
        <button
          onClick={() => router.push('/products')}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition"
        >
          ← Back to Products
        </button>
      </div>
    </div>
  );
}