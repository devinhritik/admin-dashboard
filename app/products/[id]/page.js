'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getProductById } from '@/lib/api/products';
import { isLoggedIn, logoutUser } from '@/lib/auth';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorState from '@/components/ErrorState';
import EmptyState from '@/components/EmptyState';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isLoggedIn()) {
      router.push('/login');
      return;
    }

    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError('');
        const data = await getProductById(params.id);
        setProduct(data);
      } catch (err) {
        console.error('Error fetching product details:', err);
        setError(err.message || 'Failed to load product details');
      } finally {
        setLoading(false);
      }
    };

    if (params?.id) {
      fetchProduct();
    }
  }, [params?.id, router]);

  const handleLogout = () => {
    logoutUser();
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
    router.push('/login');
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorState error={error} onRetry={() => router.push('/products')} />;
  }

  if (!product) {
    return <EmptyState searchQuery="" />;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-md overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <button
            onClick={() => router.push('/products')}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
          >
            ← Back to Products
          </button>

          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition"
          >
            Logout
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-8 p-6">
          <div className="bg-gray-100 rounded-xl overflow-hidden">
            <Image
              src={product.thumbnail}
              alt={product.title}
              width={900}
              height={600}
              className="w-full h-full object-cover min-h-[320px]"
            />
          </div>

          <div className="space-y-5">
            <div>
              <span className="inline-block bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide">
                {product.category}
              </span>
              <h1 className="text-3xl font-bold text-gray-900 mt-4">{product.title}</h1>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
              <span>⭐ {product.rating ?? 'N/A'}</span>
              <span>Brand: {product.brand || 'Unknown'}</span>
              <span>{product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}</span>
            </div>

            <div className="text-3xl font-bold text-blue-600">
              ${Number(product.price).toFixed(2)}
            </div>

            <p className="text-gray-700 leading-7">{product.description}</p>

            <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="font-semibold text-gray-800">Stock</div>
                <div>{product.stock}</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="font-semibold text-gray-800">Discount</div>
                <div>{product.discountPercentage ?? 0}%</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}