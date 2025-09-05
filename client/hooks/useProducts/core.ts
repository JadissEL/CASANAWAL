import { useState, useEffect, useRef } from 'react';
import type { MenuFilters } from './types';
import type {
  Product,
  Category,
  MenuResponse,
  MenuStatsResponse,
  SearchSuggestionsResponse
} from '@shared/api';
import { apiGet } from '@/lib/utils/api/core';

// Enhanced menu data hook with stable data
export function useMenuData(filters: MenuFilters = {}) {
  const [data, setData] = useState<MenuResponse['data'] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefetching, setIsRefetching] = useState(false);
  const previousDataRef = useRef<MenuResponse['data'] | null>(null);

  useEffect(() => {
    const fetchMenuData = async () => {
      try {
        // If we have previous data, mark as refetching to preserve UI
        if (data) {
          setIsRefetching(true);
        } else {
          setLoading(true);
        }
        setError(null);

        const result = await apiGet<MenuResponse['data']>('/menu', filters as any);

        if ((result as any).success) {
          previousDataRef.current = data;
          setData((result as any).data);
        } else {
          setError((result as any).error || 'Failed to fetch menu data');
          if (previousDataRef.current) {
            setData(previousDataRef.current);
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch menu data');
        // Keep previous data on error
        if (previousDataRef.current) {
          setData(previousDataRef.current);
        }
      } finally {
        setLoading(false);
        setIsRefetching(false);
      }
    };

    fetchMenuData();
  }, [JSON.stringify(filters)]);

  return {
    data,
    loading,
    error,
    isRefetching,
    // Provide stable data that doesn't flicker
    stableData: data || previousDataRef.current
  };
}

// Menu stats hook
export function useMenuStats() {
  const [data, setData] = useState<MenuStatsResponse['data'] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefetching, setIsRefetching] = useState(false);
  const previousDataRef = useRef<MenuStatsResponse['data'] | null>(null);

  useEffect(() => {
    const fetchMenuStats = async () => {
      try {
        if (data) {
          setIsRefetching(true);
        } else {
          setLoading(true);
        }
        setError(null);

        const result = await apiGet<MenuStatsResponse['data']>('/menu/stats');

        if ((result as any).success) {
          previousDataRef.current = data;
          setData((result as any).data);
        } else {
          setError((result as any).error || 'Failed to fetch menu stats');
          if (previousDataRef.current) {
            setData(previousDataRef.current);
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch menu stats');
        if (previousDataRef.current) {
          setData(previousDataRef.current);
        }
      } finally {
        setLoading(false);
        setIsRefetching(false);
      }
    };

    fetchMenuStats();
  }, []);

  return {
    data,
    loading,
    error,
    isRefetching,
    stableData: data || previousDataRef.current
  };
}

// Search suggestions hook
export function useSearchSuggestions(query: string, limit: number = 5) {
  const [data, setData] = useState<SearchSuggestionsResponse['data'] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isRefetching, setIsRefetching] = useState(false);
  const previousDataRef = useRef<SearchSuggestionsResponse['data'] | null>(null);

  useEffect(() => {
    if (!query || query.length < 2) {
      setData(null);
      return;
    }

    const fetchSuggestions = async () => {
      try {
        if (data) {
          setIsRefetching(true);
        } else {
          setLoading(true);
        }
        setError(null);

        const result = await apiGet<SearchSuggestionsResponse['data']>(
          '/menu/suggestions',
          { q: query, limit }
        );

        if ((result as any).success) {
          previousDataRef.current = data;
          setData((result as any).data);
        } else {
          setError((result as any).error || 'Failed to fetch suggestions');
          if (previousDataRef.current) {
            setData(previousDataRef.current);
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch suggestions');
        if (previousDataRef.current) {
          setData(previousDataRef.current);
        }
      } finally {
        setLoading(false);
        setIsRefetching(false);
      }
    };

    fetchSuggestions();
  }, [query, limit]);

  return {
    data,
    loading,
    error,
    isRefetching,
    stableData: data || previousDataRef.current
  };
}
