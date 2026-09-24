'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getProductById } from '@/lib/api/products';
import { logoutUser, isLoggedIn } from '@/lib/auth';
import { formatPrice } from '@/lib/utils';
import ProductGallery from '@/components/ProductGallery';
import ProductReviews from '@/components/ProductReviews';
import NotFound from '@/components/NotFound';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorState from '@/components/ErrorState';

export default function ProductDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id;

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notFound, setNotFound] = useState(false);

  // Check auth on mount
  useEffect(() => {
    if (!isLoggedIn()) {
      router.push('/login');
      return;
    }

    fetchProduct();
  }, [productId, router]);

  // Fetch product details
  const fetchProduct = async () => {
    try {
      setLoading(true);
      setError('');
      setNotFound(false);

      console.log(`Fetching product ${productId}`);

      const data = await getProductById(productId);

      if (!data || !data.id) {
        console.log('Product not found');
        setNotFound(true);
      } else {
        console.log('Product loaded:', data.title);
        setProduct(data);
      }
    } catch (err) {
      console.error('Error fetching product:', err);

      // 404 error
      if (err.response?.status === 404) {
        setNotFound(true);
      } else {
        setError(err.message || 'Failed to load product details');
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle logout
  const handleLogout = () => {
    logoutUser();
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
    router.push('/login');
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto p-4">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  // Not found state
  if (notFound) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto p-4 mb-8">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">Product Details</h1>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg"
            >
              Logout
            </button>
          </div>
        </div>
        <NotFound productId={productId} />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto p-4">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold text-gray-800">Product Details</h1>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg"
            >
              Logout
            </button>
          </div>
          <ErrorState error={error} onRetry={fetchProduct} />
        </div>
      </div>
    );
  }

  // Product loaded
  if (!product) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={() => router.back()}
            className="text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-2"
          >
            ← Back
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg"
          >
            Logout
          </button>
        </div>

        {/* Product Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Left: Image Gallery */}
          <div>
            <ProductGallery images={product.images} title={product.title} />
          </div>

          {/* Right: Product Info */}
          <div>
            {/* Title */}
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{product.title}</h1>

            {/* Category & Brand */}
            <div className="flex gap-4 mb-4">
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium capitalize">
                {product.category}
              </span>
              {product.brand && (
                <span className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm">
                  {product.brand}
                </span>
              )}
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl font-bold text-gray-800">{product.rating}</span>
              <span className="text-2xl">⭐</span>
              <span className="text-gray-600 text-sm">
                ({product.reviews?.length || 0} reviews)
              </span>
            </div>

            {/* Price Section */}
            <div className="bg-blue-50 rounded-lg p-4 mb-6 border border-blue-200">
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-3xl font-bold text-blue-600">
                  {formatPrice(product.price)}
                </span>
                {product.discountPercentage > 0 && (
                  <span className="text-lg text-gray-600 line-through">
                    {formatPrice(product.price / (1 - product.discountPercentage / 100))}
                  </span>
                )}
              </div>
              {product.discountPercentage > 0 && (
                <span className="text-green-600 font-semibold">
                  Save {product.discountPercentage}%
                </span>
              )}
            </div>

            {/* Stock Status */}
            <div className="mb-6">
              <span
                className={`text-lg font-semibold px-4 py-2 rounded-lg ${
                  product.stock > 0
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
              </span>
            </div>

            {/* Add to Cart Button */}
            <button
              disabled={product.stock === 0}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-lg transition mb-4"
            >
              🛒 Add to Cart
            </button>

            {/* Description */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-bold text-gray-800 mb-2">Description</h3>
              <p className="text-gray-600 leading-relaxed">{product.description}</p>
            </div>

            {/* Additional Info */}
            {product.warrantyInformation && (
              <div className="border-t mt-6 pt-6">
                <h3 className="text-lg font-bold text-gray-800 mb-2">Warranty</h3>
                <p className="text-gray-600">{product.warrantyInformation}</p>
              </div>
            )}

            {product.shippingInformation && (
              <div className="border-t mt-6 pt-6">
                <h3 className="text-lg font-bold text-gray-800 mb-2">Shipping</h3>
                <p className="text-gray-600">{product.shippingInformation}</p>
              </div>
            )}

            {product.returnPolicy && (
              <div className="border-t mt-6 pt-6">
                <h3 className="text-lg font-bold text-gray-800 mb-2">Return Policy</h3>
                <p className="text-gray-600">{product.returnPolicy}</p>
              </div>
            )}
          </div>
        </div>

        {/* Reviews Section */}
        {product.reviews && product.reviews.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Customer Reviews</h2>
            <ProductReviews reviews={product.reviews} />
          </div>
        )}
      </div>
    </div>
  );
}