import { useState } from 'react';
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { useDebounce } from './useDebounce';

export type SearchFilters = Record<string, unknown>;

export interface UseDynamicSearchConfig<TResult, TFilters extends SearchFilters = SearchFilters> {
  /** Called with the debounced query and current filters. Must return a promise of results. */
  onSearch: (query: string, filters: TFilters) => Promise<TResult[]>;
  /** Milliseconds to wait after the user stops typing before searching. Default 500. */
  debounceTime?: number;
  /** Minimum query length before a search fires. Default 2. */
  minQueryLength?: number;
  /** Starting filter values. Default {}. */
  initialFilters?: TFilters;
}

export interface UseDynamicSearchResult<TResult, TFilters extends SearchFilters = SearchFilters> {
  query: string;
  setQuery: (value: string) => void;
  filters: TFilters;
  setFilters: React.Dispatch<React.SetStateAction<TFilters>>;
  results: TResult[];
  isLoading: boolean;
  isFetching: boolean;
  error: UseQueryResult['error'];
}

/**
 * useDynamicSearch — debounced, filterable, cache-aware search hook.
 *
 * @example
 * const { query, setQuery, results, isLoading } = useDynamicSearch({
 *   onSearch: (q, filters) => fetch(`/api/products?q=${q}`).then(r => r.json()),
 * });
 */
export function useDynamicSearch<TResult, TFilters extends SearchFilters = SearchFilters>({
  onSearch,
  debounceTime = 500,
  minQueryLength = 2,
  initialFilters = {} as TFilters,
}: UseDynamicSearchConfig<TResult, TFilters>): UseDynamicSearchResult<TResult, TFilters> {
  if (typeof onSearch !== 'function') {
    throw new Error('useDynamicSearch: onSearch must be a function');
  }

  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<TFilters>(initialFilters);

  const debouncedQuery = useDebounce(query, debounceTime);

  const { data, isLoading, isFetching, error } = useQuery({
    queryKey: ['dynamicSearch', debouncedQuery, filters],
    queryFn: () => onSearch(debouncedQuery, filters),
    enabled: debouncedQuery.length >= minQueryLength,
  });

  return {
    query,
    setQuery,
    filters,
    setFilters,
    results: data ?? [],
    isLoading,
    isFetching,
    error,
  };
}
