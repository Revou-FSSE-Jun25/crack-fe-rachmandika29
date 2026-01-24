import { renderHook, act } from '@testing-library/react';
import { useSearchField } from '@/lib/hooks/useSearchField';

describe('useSearchField', () => {
  it('initializes correctly', () => {
    const { result } = renderHook(() => useSearchField('init'));
    expect(result.current.value).toBe('init');
    expect(result.current.hasQuery).toBe(true);
  });

  it('updates value', () => {
    const { result } = renderHook(() => useSearchField());
    act(() => {
      result.current.setValue('test');
    });
    expect(result.current.value).toBe('test');
    expect(result.current.hasQuery).toBe(true);
  });

  it('clears value', () => {
    const { result } = renderHook(() => useSearchField('test'));
    act(() => {
      result.current.clear();
    });
    expect(result.current.value).toBe('');
    expect(result.current.hasQuery).toBe(false);
  });

  it('clears on escape', () => {
    const { result } = renderHook(() => useSearchField('test'));
    act(() => {
      result.current.onKeyDown({ key: 'Escape' } as any);
    });
    expect(result.current.value).toBe('');
  });

  it('ignores other keys', () => {
    const { result } = renderHook(() => useSearchField('test'));
    act(() => {
      result.current.onKeyDown({ key: 'Enter' } as any);
    });
    expect(result.current.value).toBe('test');
  });
});
