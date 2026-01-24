import { renderHook, act } from '@testing-library/react';
import { useDebouncedValue } from '@/lib/hooks/useDebouncedValue';

jest.useFakeTimers();

describe('useDebouncedValue', () => {
  it('returns initial value immediately', () => {
    const { result } = renderHook(() => useDebouncedValue('test', 500));
    expect(result.current).toBe('test');
  });

  it('updates value after delay', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebouncedValue(value, delay),
      { initialProps: { value: 'test', delay: 500 } }
    );

    rerender({ value: 'updated', delay: 500 });
    
    // Value shouldn't change yet
    expect(result.current).toBe('test');

    // Fast forward time
    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(result.current).toBe('updated');
  });
});
