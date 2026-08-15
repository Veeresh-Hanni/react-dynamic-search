import { useState, useEffect } from 'react';

/**
 * useDebounce — delays updating a value until `delay` ms have passed
 * without it changing again. Internal helper for useDynamicSearch.
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}
