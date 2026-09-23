'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getProducts } from '@/lib/api/products';
import { logoutUser, isLoggedIn } from '@/lib/auth';
import {
  calculateSkip,
  calculateTotalPages,
  getPaginationInfo,
  validatePageNumber,
  validateLimit,
  VALID_LIMITS,
} from '@/lib/utils';
import ProductTable from '@/components/ProductTable';
import ProductCard from '@/components/ProductCard';
import Pagination from '@/components/Pagination';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorState from '@/components/ErrorState';
import EmptyState from '@/components/EmptyState';

export default function ProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get URL params
  const urlPage = searchParams.get('page') || '1';
  const urlLimit = searchParams.get('limit') || '10';

  // Validate URL params
  const [limit, setLimit] = useState(() => validateLimit(urlLimit));
  const [page, setPage] = useState(1);
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Initialize page from URL
  useEffect(() => {
    if (!isLoggedIn()) {
      router.push('/login');
      return;
    }

    // Validate and set page
    const validPage = validatePageNumber(parseInt(urlPage, 10), 100); // Assume max 100 pages
    setPage(validPage);
  }, [router]);

  // Fetch products when page or limit changes
  useEffect(() => {
    if (page === 0) return; // Wait for page to initialize
    fetchProducts();
  }, [page, limit]);

  // Fetch products function
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError('');

      console.log(`Fetching page ${page}, limit ${limit}`);

      // Calculate skip value
      const skip = calculateSkip(page, limit);

      // Call API
      const response = await getProducts(limit, skip);

      console.log(`Received ${response.products.length} products, total: ${response.total}`);

      setProducts(response.products || []);
      setTotal(response.total || 0);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(err.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    console.log(`Changing to page ${newPage}`);
    
    // Update URL
    router.push(`/products?page=${newPage}&limit=${limit}`);
    
    // Update state (triggers useEffect)
    setPage(newPage);
  };

  // Handle limit change
  const handleLimitChange = (newLimit) => {
    console.log(`Changing limit to ${newLimit}`);
    
    // Reset to page 1 when changing limit
    router.push(`/products?page=1&limit=${newLimit}`);
    
    setPage(1);
    setLimit(newLimit);
  };

  // Handle product click
  const handleProductClick = (id) => {
    router.push(`/products/${id}`);
  };

  // Handle logout
  const handleLogout = () => {
    logoutUser();
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
    router.push('/login');
  };

  // Calculate pagination info
  const totalPages = calculateTotalPages(total, limit);
  const validPage = validatePageNumber(page, totalPages);
  
  const paginationInfo = getPaginationInfo(
    validPage,
    limit,
    total,
    products.length
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Products</h1>
            <p className="text-gray-600 mt-1">
              Total: {total} products
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

        {/* Pagination */}
        {!loading && !error && products.length > 0 && (
          <Pagination
            currentPage={validPage}
            totalPages={totalPages}
            limit={limit}
            total={total}
            startIndex={paginationInfo.startIndex}
            endIndex={paginationInfo.endIndex}
            onPageChange={handlePageChange}
            onLimitChange={handleLimitChange}
            isLoading={loading}
          />
        )}
      </div>
    </div>
  );
}