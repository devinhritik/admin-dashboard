'use client';

import { Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  getProducts,
  searchProducts,
  getCategories,
  getProductsByCategory,
} from '@/lib/api/products';
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
  sortProducts,
  validateSort,
} from '@/lib/utils';
import ProductTable from '@/components/ProductTable';
import ProductCard from '@/components/ProductCard';
import SearchBar from '@/components/SearchBar';
import FilterSort from '@/components/FilterSort';
import Pagination from '@/components/Pagination';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorState from '@/components/ErrorState';
import EmptyState from '@/components/EmptyState';

function ProductsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const urlPage = searchParams.get('page') || '1';
  const urlLimit = searchParams.get('limit') || '10';
  const urlSearch = searchParams.get('search') || '';
  const urlCategory = searchParams.get('category') || '';
  const urlSort = searchParams.get('sort') || 'none';

  const [limit, setLimit] = useState(() => validateLimit(urlLimit));
  const [page, setPage] = useState(() => validatePageNumber(parseInt(urlPage, 10), 100));
  const [search, setSearch] = useState(urlSearch);
  const [category, setCategory] = useState(urlCategory);
  const [sort, setSort] = useState(() => validateSort(urlSort));
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const latestSearchRequestId = useRef(null);
  const debouncedSearch = useRef(null);

  const fetchCategories = useCallback(async () => {
    try {
      const data = await getCategories();
      const normalizedCategories = Array.isArray(data)
        ? data.map((item) => {
            if (typeof item === 'string') return item;
            return item?.slug || item?.name || '';
          }).filter(Boolean)
        : [];

      setCategories(normalizedCategories);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  }, []);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      const skip = calculateSkip(page, limit);
      const response = await getProducts(limit, skip);

      if (sort !== 'none') {
        response.products = sortProducts(response.products, sort);
      }

      setProducts(response.products || []);
      setTotal(response.total || 0);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(err.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  }, [limit, page, sort]);

  const fetchCategoryProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      const skip = calculateSkip(page, limit);
      const response = await getProductsByCategory(category, limit, skip);

      if (sort !== 'none') {
        response.products = sortProducts(response.products, sort);
      }

      setProducts(response.products || []);
      setTotal(response.total || 0);
    } catch (err) {
      console.error('Error fetching category products:', err);
      setError(err.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  }, [category, limit, page, sort]);

  const fetchSearchResults = useCallback(async (requestId) => {
    try {
      setLoading(true);
      setError('');

      const skip = calculateSkip(page, limit);
      const response = await searchProducts(search, limit, skip);

      if (requestId && !isLatestRequest(requestId, latestSearchRequestId.current)) {
        return;
      }

      if (sort !== 'none') {
        response.products = sortProducts(response.products, sort);
      }

      setProducts(response.products || []);
      setTotal(response.total || 0);
    } catch (err) {
      console.error('Error searching products:', err);
      setError(err.message || 'Failed to search products');
    } finally {
      setLoading(false);
    }
  }, [limit, page, search, sort]);

  useEffect(() => {
    if (!isLoggedIn()) {
      router.push('/login');
      return;
    }

    resetRequestId();

    const timer = setTimeout(() => {
      void fetchCategories();
    }, 0);

    return () => clearTimeout(timer);
  }, [fetchCategories, router]);

  useEffect(() => {
    debouncedSearch.current = debounceSearch((requestId, newSearch) => {
      latestSearchRequestId.current = requestId;

      router.push(
        `/products?search=${encodeURIComponent(newSearch)}&page=1&limit=${limit}&sort=${sort}`
      );
      setPage(1);
      setSearch(newSearch);
      setCategory('');
    }, 500);
  }, [limit, router, sort]);

  useEffect(() => {
    if (page === 0) return;

    if (search) {
      fetchSearchResults(latestSearchRequestId.current);
    } else if (category) {
      fetchCategoryProducts();
    } else {
      fetchProducts();
    }
  }, [category, fetchCategoryProducts, fetchProducts, fetchSearchResults, page, search]);

  const handleSearchChange = (newSearch) => {
    if (newSearch === '') {
      router.push(`/products?page=1&limit=${limit}&sort=${sort}`);
      setPage(1);
      setSearch('');
      setCategory('');
      return;
    }

    debouncedSearch.current(newSearch);
  };

  const handleCategoryChange = (newCategory) => {
    router.push(
      `/products?category=${newCategory}&page=1&limit=${limit}&sort=${sort}`
    );
    setPage(1);
    setCategory(newCategory);
  };

  const handleSortChange = (newSort) => {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (category) params.append('category', category);
    params.append('sort', newSort);
    params.append('page', '1');
    params.append('limit', limit);

    router.push(`/products?${params.toString()}`);
    setPage(1);
    setSort(newSort);
  };

  const handlePageChange = (newPage) => {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (category) params.append('category', category);
    params.append('page', newPage);
    params.append('limit', limit);
    params.append('sort', sort);

    router.push(`/products?${params.toString()}`);
    setPage(newPage);
  };

  const handleLimitChange = (newLimit) => {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (category) params.append('category', category);
    params.append('page', '1');
    params.append('limit', newLimit);
    params.append('sort', sort);

    router.push(`/products?${params.toString()}`);
    setPage(1);
    setLimit(newLimit);
  };

  const handleProductClick = (id) => {
    router.push(`/products/${id}`);
  };

  const handleLogout = () => {
    logoutUser();
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
    router.push('/login');
  };

  const totalPages = calculateTotalPages(total, limit);
  const validPage = validatePageNumber(page, totalPages);
  const paginationInfo = getPaginationInfo(validPage, limit, total, products.length);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Products</h1>
            <p className="text-gray-600 mt-1">
              Total: {total} products
              {search && <span> matching &lsquo;{search}&rsquo;</span>}
              {category && <span> in {category}</span>}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
          >
            Logout
          </button>
        </div>

        <SearchBar
          value={search}
          onChange={handleSearchChange}
          isLoading={loading}
          placeholder="Search products by name, brand, category..."
        />

        <FilterSort
          categories={categories}
          selectedCategory={category}
          selectedSort={sort}
          onCategoryChange={handleCategoryChange}
          onSortChange={handleSortChange}
          isLoading={loading}
          isSearching={!!search}
        />

        {loading && <LoadingSpinner />}

        {!loading && error && (
          <ErrorState
            error={error}
            onRetry={() => {
              if (search) {
                fetchSearchResults(latestSearchRequestId.current);
              } else if (category) {
                fetchCategoryProducts();
              } else {
                fetchProducts();
              }
            }}
          />
        )}

        {!loading && !error && products.length === 0 && (
          <EmptyState searchQuery={search} />
        )}

        {!loading && !error && products.length > 0 && (
          <div className="hidden md:block">
            <ProductTable
              products={products}
              onProductClick={handleProductClick}
            />
          </div>
        )}

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

export default function ProductsPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <ProductsPageContent />
    </Suspense>
  );
}