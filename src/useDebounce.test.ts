import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useDebounce } from './useDebounce';

describe('useDebounce', () => {
  it('returns the initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('a', 500));
    expect(result.current).toBe('a');
  });

  it('updates only after the delay', () => {
    vi.useFakeTimers();
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 500),
      { initialProps: { value: 'a' } }
    );

    rerender({ value: 'b' });
    expect(result.current).toBe('a'); // not yet updated

    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(result.current).toBe('b'); // updated after delay
    vi.useRealTimers();
  });
});