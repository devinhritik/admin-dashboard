'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getProducts, searchProducts } from '@/lib/api/products';
import { logoutUser, isLoggedIn } from '@/lib/auth';
import {
  calculateSkip,
  calculateTotalPages,
  getPaginationInfo,
  validatePageNumber,
  validateLimit,
  debounceSearch,
  isLatestRequest,
  resetRequestId,
} from '@/lib/utils';
import ProductTable from '@/components/ProductTable';
import ProductCard from '@/components/ProductCard';
import SearchBar from '@/components/SearchBar';
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
  const urlSearch = searchParams.get('search') || '';

  // State
  const [limit, setLimit] = useState(() => validateLimit(urlLimit));
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState(urlSearch);
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Track latest search request
  const latestSearchRequestId = useRef(null);
  const debouncedSearch = useRef(null);

  // Initialize page from URL
  useEffect(() => {
    console.log('ProductsPage mounted');

    if (!isLoggedIn()) {
      router.push('/login');
      return;
    }

    resetRequestId(); // Reset for fresh start
    const validPage = validatePageNumber(parseInt(urlPage, 10), 100);
    setPage(validPage);
    setSearch(urlSearch);
  }, [router]);

  // Initialize debounce function ONCE
  useEffect(() => {
    debouncedSearch.current = debounceSearch((requestId, newSearch) => {
      console.log(`Debounce complete for request ${requestId}: "${newSearch}"`);

      latestSearchRequestId.current = requestId;

      router.push(
        `/products?search=${encodeURIComponent(newSearch)}&page=1&limit=${limit}`
      );
      setPage(1);
      setSearch(newSearch);
    }, 500);
  }, [limit, router]);

  // Fetch products when page or limit changes
  useEffect(() => {
    if (page === 0) return;

    console.log(`Fetching: page=${page}, limit=${limit}, search=${search}`);

    if (search) {
      // Search API call
      fetchSearchResults();
    } else {
      // Regular products API call
      fetchProducts();
    }
  }, [page, limit, search]);

  // Fetch regular products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError('');

      const skip = calculateSkip(page, limit);
      const response = await getProducts(limit, skip);

      setProducts(response.products || []);
      setTotal(response.total || 0);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(err.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  // Fetch search results
  const fetchSearchResults = async (requestId) => {
    try {
      setLoading(true);
      setError('');

      const skip = calculateSkip(page, limit);
      const response = await searchProducts(search, limit, skip);

      // Check if this is still the latest request
      if (requestId && !isLatestRequest(requestId, latestSearchRequestId.current)) {
        console.log(`Ignoring old search request ${requestId}`);
        return;
      }

      setProducts(response.products || []);
      setTotal(response.total || 0);
    } catch (err) {
      console.error('Error searching products:', err);
      setError(err.message || 'Failed to search products');
    } finally {
      setLoading(false);
    }
  };

  // Handle search input change
  const handleSearchChange = (newSearch) => {
    console.log(`User typed: "${newSearch}"`);

    // Call debounced search
    debouncedSearch.current(newSearch);
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    console.log(`Changing to page ${newPage}`);
    router.push(
      `/products?search=${encodeURIComponent(search)}&page=${newPage}&limit=${limit}`
    );
    setPage(newPage);
  };

  // Handle limit change
  const handleLimitChange = (newLimit) => {
    console.log(`Changing limit to ${newLimit}`);
    router.push(
      `/products?search=${encodeURIComponent(search)}&page=1&limit=${newLimit}`
    );
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
              {search && <span> matching "{search}"</span>}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
          >
            Logout
          </button>
        </div>

        {/* Search Bar */}
        <SearchBar
          value={search}
          onChange={handleSearchChange}
          isLoading={loading}
          placeholder="Search products by name, brand, category..."
        />

        {/* Loading State */}
        {loading && <LoadingSpinner />}

        {/* Error State */}
        {!loading && error && (
          <ErrorState
            error={error}
            onRetry={() => {
              if (search) {
                fetchSearchResults(latestSearchRequestId.current);
              } else {
                fetchProducts();
              }
            }}
          />
        )}

        {/* Empty State */}
        {!loading && !error && products.length === 0 && (
          <EmptyState searchQuery={search} />
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