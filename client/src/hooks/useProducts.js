import { useState, useEffect, useCallback } from 'react';
import { productAPI } from '../api/endpoints';

export function useProducts(initialParams = {}) {
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await productAPI.getAll({ ...initialParams, ...params });
      setProducts(data.products);
      setPagination(data.pagination);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts(initialParams);
  }, []);

  return { products, pagination, loading, error, refetch: fetchProducts };
}
