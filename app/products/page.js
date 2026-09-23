'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getProducts } from '@/lib/api/products';
import { logoutUser, isLoggedIn } from '@/lib/auth';
import ProductTable from '@/components/ProductTable';
import ProductCard from '@/components/ProductCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorState from '@/components/ErrorState';
import EmptyState from '@/components/EmptyState';

export default function ProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isMounted, setIsMounted] = useState(false);

  // Only run on client mount
  useEffect(() => {
    setIsMounted(true);
    
    // Check auth AFTER mount
    if (!isLoggedIn()) {
      router.push('/login');
      return;
    }
    
    // Fetch products
    fetchProducts();
  }, [router]);

  // Fetch products function
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError('');
      
      console.log('Fetching products...');
      
      const response = await getProducts(10, 0);
      
      console.log('Products received:', response.products?.length);
      
      setProducts(response.products || []);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(err.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleProductClick = (id) => {
    router.push(`/products/${id}`);
  };

  const handleLogout = () => {
    logoutUser();
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
    router.push('/login');
  };

  // Always render same structure (server and client match)
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Products</h1>
            <p className="text-gray-600 mt-1">
              Total: {products.length} products
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
          >
            Logout
          </button>
        </div>

        {/* Loading State */}
        {loading && <LoadingSpinner />}

        {/* Error State */}
        {!loading && error && (
          <ErrorState error={error} onRetry={fetchProducts} />
        )}

        {/* Empty State */}
        {!loading && !error && products.length === 0 && (
          <EmptyState />
        )}

        {/* Products - Desktop Table */}
        {!loading && !error && products.length > 0 && (
          <div className="hidden md:block">
            <ProductTable
              products={products}
              onProductClick={handleProductClick}
            />
          </div>
        )}

        {/* Products - Mobile Cards */}
        {!loading && !error && products.length > 0 && (
          <div className="md:hidden grid grid-cols-1 sm:grid-cols-2 gap-4">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onProductClick={handleProductClick}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}