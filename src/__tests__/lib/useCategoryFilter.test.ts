import { renderHook, act } from '@testing-library/react';
import { useCategoryFilter } from '@/lib/hooks/useCategoryFilter';

describe('useCategoryFilter', () => {
  it('initializes correctly', () => {
    const { result } = renderHook(() => useCategoryFilter(['A', 'B']));
    expect(result.current.selectedCategory).toBeNull();
    expect(result.current.chips).toEqual(['A', 'B']);
  });

  it('selects category', () => {
    const { result } = renderHook(() => useCategoryFilter(['A', 'B']));
    act(() => {
      result.current.setSelectedCategory('A');
    });
    expect(result.current.selectedCategory).toBe('A');
  });

  it('selects all', () => {
    const { result } = renderHook(() => useCategoryFilter(['A', 'B'], 'A'));
    expect(result.current.selectedCategory).toBe('A');
    
    act(() => {
      result.current.selectAll();
    });
    expect(result.current.selectedCategory).toBeNull();
  });
});
